import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY);

/**
 * Tai Sui API: the four annual feng shui afflictions for a solar year, plus the
 * annual flying star plate they are read against. The feng shui year turns over
 * at Li Chun in early February, not on 1 January, so this sample reads
 * changeoverDate off the response and picks the year actually in force.
 */

const today = new Date().toISOString().slice(0, 10);
const requestedYear = Number(process.env.YEAR ?? today.slice(0, 4));

async function afflictions(year) {
  const { data, error } = await roxy.fengShui.getAnnualAfflictions({ path: { year } });
  if (error) throw new Error(error.error);
  return data;
}

async function main() {
  let annual = await afflictions(requestedYear);

  if (today < annual.changeoverDate) {
    console.log(`Today is ${today}, before the ${requestedYear} changeover on ${annual.changeoverDate}.`);
    console.log(`The ${requestedYear - 1} positions are still in force.\n`);
    annual = await afflictions(requestedYear - 1);
  }

  console.log(`Feng shui year ${annual.year}, branch ${annual.yearBranch}, in force from ${annual.changeoverDate}`);
  console.log(`Tai Sui      ${annual.taiSui.direction} ${annual.taiSui.mountain.label}, animal ${annual.taiSui.animal}, clashes with ${annual.taiSui.clashingAnimal}`);
  console.log(`Sui Po       ${annual.suiPo.direction} ${annual.suiPo.mountain.label}`);
  console.log(`San Sha      ${annual.sanSha.direction} ${annual.sanSha.startDegree} to ${annual.sanSha.endDegree} degrees`);
  console.log(`Five Yellow  ${annual.fiveYellow.palace}, drained by ${annual.fiveYellow.remedy}`);

  const { data: plate, error: plateError } = await roxy.fengShui.getAnnualFlyingStars({
    path: { year: annual.year },
  });
  if (plateError) throw new Error(plateError.error);

  console.log(`\nAnnual flying stars ${plate.year}, center star ${plate.centerStar}, from ${plate.changeoverDate}`);
  for (const palace of plate.palaces) {
    console.log(`  ${palace.palace.padEnd(10)} ${palace.star}  ${palace.name.padEnd(12)} ${palace.nature}`);
  }
}

main().catch(console.error);
