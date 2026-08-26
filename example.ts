import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY!);

/**
 * Tai Sui API: the four annual feng shui afflictions for a solar year, plus the
 * annual flying star plate that sits under them. Tai Sui and Sui Po on their
 * exact 15 degree mountains, the Three Killings across its 75 degree span, and
 * the Five Yellow wherever it lands on the plate.
 *
 * The feng shui year turns over at Li Chun in early February, not on 1 January
 * and not at Lunar New Year, so this sample reads changeoverDate off the
 * response and works out which year is actually in force today.
 */

const today = new Date().toISOString().slice(0, 10);
const requestedYear = Number(process.env.YEAR ?? today.slice(0, 4));

async function afflictions(year: number) {
  const { data, error } = await roxy.fengShui.getAnnualAfflictions({ path: { year } });
  if (error) throw new Error(error.error);
  return data;
}

async function main() {
  let annual = await afflictions(requestedYear);

  // Before the changeover the previous solar year is still running. This is the
  // whole reason changeoverDate ships on the response.
  if (today < annual.changeoverDate) {
    console.log(
      `Today is ${today}, before the ${requestedYear} changeover on ${annual.changeoverDate}.`
    );
    console.log(`The ${requestedYear - 1} positions are still in force.\n`);
    annual = await afflictions(requestedYear - 1);
  }

  console.log(`Feng shui year ${annual.year}, branch ${annual.yearBranch}`);
  console.log(`In force from ${annual.changeoverDate}\n`);

  console.log('The four afflictions');
  console.log(
    `  Tai Sui       ${annual.taiSui.direction.padEnd(10)} ${annual.taiSui.mountain.label} (${annual.taiSui.mountain.id}), ${annual.taiSui.mountain.startDegree} to ${annual.taiSui.mountain.endDegree} degrees`
  );
  console.log(
    `  Sui Po        ${annual.suiPo.direction.padEnd(10)} ${annual.suiPo.mountain.label} (${annual.suiPo.mountain.id}), ${annual.suiPo.mountain.startDegree} to ${annual.suiPo.mountain.endDegree} degrees`
  );
  console.log(
    `  San Sha       ${annual.sanSha.direction.padEnd(10)} ${annual.sanSha.startDegree} to ${annual.sanSha.endDegree} degrees, opposite the ${annual.sanSha.frameElement} frame`
  );
  console.log(
    `  Five Yellow   ${annual.fiveYellow.palace.padEnd(10)} star ${annual.fiveYellow.star}, drained by ${annual.fiveYellow.remedy}`
  );

  console.log(
    `\nYear animal ${annual.taiSui.animal}, so the ${annual.taiSui.clashingAnimal} clashes with Tai Sui head on.`
  );
  console.log('The Three Killings read in three parts, first to last in compass order:');
  for (const part of annual.sanSha.parts) {
    console.log(`  ${part.mountain.label.padEnd(4)} ${part.mountain.direction.padEnd(10)} ${part.name}`);
  }

  // The annual plate is the layer the Five Yellow is read off, so pull it for the
  // same year and rebuild the sector grid a yearly guide renders.
  const { data: plate, error: plateError } = await roxy.fengShui.getAnnualFlyingStars({
    path: { year: annual.year },
  });
  if (plateError) throw new Error(plateError.error);

  console.log(`\nAnnual flying stars ${plate.year}, center star ${plate.centerStar}`);
  for (const palace of plate.palaces) {
    const flag = palace.palace === annual.fiveYellow.palace ? '  <- Five Yellow' : '';
    console.log(
      `  ${palace.palace.padEnd(10)} ${palace.star}  ${palace.name.padEnd(12)} ${palace.element.padEnd(6)} ${palace.nature.padEnd(14)} remedy ${palace.remedy}${flag}`
    );
  }
}

main().catch(console.error);
