import React from "react";
import { Composition } from "remotion";
import { Reel01, REEL01_DURATION } from "./Reel01";
import { Ksyusha, KSYUSHA_DURATION } from "./Ksyusha";
import { PatreonTheo, PATREON_THEO_DURATION } from "./PatreonTheo";
import { PatreonPumpkin, PATREON_PUMPKIN_DURATION } from "./PatreonPumpkin";
import { PatreonPumba, PATREON_PUMBA_DURATION } from "./PatreonPumba";
import { PatreonSwane, PATREON_SWANE_DURATION } from "./PatreonSwane";
import { Reel, type ReelConfig } from "./Reel";
import { batch4, batch5, batch6, batch7, batch8, batch9, batch10, batch11, batch12, batch13, batch14, batch15, batch16, batch17, batch18, batch19, batch20, batch21, batch22, batch23, batch24 } from "./batch4";
import { amy, dogReviews, dogThinks, eaters, nameSays, ownerTypes, pick, pla, signs, snaps, stl, unique, zodiac } from "./reels";

const reels: Record<string, ReelConfig> = { Amy: amy, PlaVsPetg: pla, OneOfAKind: unique, Stl: stl, PickABowl: pick, NameSays: nameSays, Eaters: eaters, Signs: signs, Zodiac: zodiac, DogThinks: dogThinks, DogReviews: dogReviews, OwnerTypes: ownerTypes, Snaps: snaps, ...batch4, ...batch5, ...batch6, ...batch7, ...batch8, ...batch9, ...batch10, ...batch11, ...batch12, ...batch13, ...batch14, ...batch15, ...batch16, ...batch17, ...batch18, ...batch19, ...batch20, ...batch21, ...batch22, ...batch23, ...batch24 };

export const Root: React.FC = () => (
  <>
    <Composition id="Reel01" component={Reel01} durationInFrames={REEL01_DURATION} fps={30} width={1080} height={1920} defaultProps={{ voiceover: true }} />
    <Composition id="PatreonPumba" component={PatreonPumba} durationInFrames={PATREON_PUMBA_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="PatreonSwane" component={PatreonSwane} durationInFrames={PATREON_SWANE_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="PatreonPumpkin" component={PatreonPumpkin} durationInFrames={PATREON_PUMPKIN_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="PatreonTheo" component={PatreonTheo} durationInFrames={PATREON_THEO_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="Ksyusha" component={Ksyusha} durationInFrames={KSYUSHA_DURATION} fps={30} width={1080} height={1920} />
    {Object.entries(reels).map(([id, config]) => (
      <Composition key={id} id={id} component={Reel} durationInFrames={config.duration} fps={30} width={1080} height={1920} defaultProps={{ config, voiceover: true }} />
    ))}
  </>
);
