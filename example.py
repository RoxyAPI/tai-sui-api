"""
Tai Sui API: the four annual feng shui afflictions for a solar year, plus the
annual flying star plate that sits under them. Tai Sui and Sui Po on their exact
15 degree mountains, the Three Killings across its 75 degree span, and the Five
Yellow wherever it lands on the plate.

The feng shui year turns over at Li Chun in early February, not on 1 January and
not at Lunar New Year, so this sample reads changeoverDate off the response and
works out which year is actually in force today.
"""

import os
from datetime import date

from roxy_sdk import create_roxy

roxy = create_roxy(os.environ["ROXY_API_KEY"])

TODAY = date.today().isoformat()
REQUESTED_YEAR = int(os.environ.get("YEAR", TODAY[:4]))


def main():
    annual = roxy.feng_shui.get_annual_afflictions(year=str(REQUESTED_YEAR))

    # Before the changeover the previous solar year is still running. This is the
    # whole reason changeoverDate ships on the response.
    if TODAY < annual["changeoverDate"]:
        print(f"Today is {TODAY}, before the {REQUESTED_YEAR} changeover on {annual['changeoverDate']}.")
        print(f"The {REQUESTED_YEAR - 1} positions are still in force.\n")
        annual = roxy.feng_shui.get_annual_afflictions(year=str(REQUESTED_YEAR - 1))

    tai_sui, sui_po, san_sha, five_yellow = (
        annual["taiSui"],
        annual["suiPo"],
        annual["sanSha"],
        annual["fiveYellow"],
    )

    print(f"Feng shui year {annual['year']}, branch {annual['yearBranch']}")
    print(f"In force from {annual['changeoverDate']}\n")

    print("The four afflictions")
    print(
        f"  Tai Sui       {tai_sui['direction']:<10} {tai_sui['mountain']['label']} "
        f"({tai_sui['mountain']['id']}), {tai_sui['mountain']['startDegree']} to "
        f"{tai_sui['mountain']['endDegree']} degrees"
    )
    print(
        f"  Sui Po        {sui_po['direction']:<10} {sui_po['mountain']['label']} "
        f"({sui_po['mountain']['id']}), {sui_po['mountain']['startDegree']} to "
        f"{sui_po['mountain']['endDegree']} degrees"
    )
    print(
        f"  San Sha       {san_sha['direction']:<10} {san_sha['startDegree']} to "
        f"{san_sha['endDegree']} degrees, opposite the {san_sha['frameElement']} frame"
    )
    print(
        f"  Five Yellow   {five_yellow['palace']:<10} star {five_yellow['star']}, "
        f"drained by {five_yellow['remedy']}"
    )

    print(
        f"\nYear animal {tai_sui['animal']}, so the {tai_sui['clashingAnimal']} "
        "clashes with Tai Sui head on."
    )
    print("The Three Killings read in three parts, first to last in compass order:")
    for part in san_sha["parts"]:
        print(f"  {part['mountain']['label']:<4} {part['mountain']['direction']:<10} {part['name']}")

    # The annual plate is the layer the Five Yellow is read off, so pull it for the
    # same year and rebuild the sector grid a yearly guide renders.
    plate = roxy.feng_shui.get_annual_flying_stars(year=str(annual["year"]))

    print(f"\nAnnual flying stars {plate['year']}, center star {plate['centerStar']}")
    for palace in plate["palaces"]:
        flag = "  <- Five Yellow" if palace["palace"] == five_yellow["palace"] else ""
        print(
            f"  {palace['palace']:<10} {palace['star']}  {palace['name']:<12} "
            f"{palace['element']:<6} {palace['nature']:<14} remedy {palace['remedy']}{flag}"
        )


if __name__ == "__main__":
    main()
