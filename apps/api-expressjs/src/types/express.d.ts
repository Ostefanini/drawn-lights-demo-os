import type { AssetModel as Asset, Combination, User } from "@drawn-lights-demo/prisma";
import { Sound } from "@drawn-lights-demo/shared";

declare global {
    namespace Express {
        interface Locals {
            asset?: Asset;
            assetOne?: AssetName;
            assetTwo?: AssetName;
            assetThree?: AssetName;
            assetFour?: AssetName;
            sound?: Sound;
            combination?: Combination & {
                foundBy: User;
            };
        }
    }
}

export { };
