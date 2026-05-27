declare type demoPlaystationModels = {
  name: string;
  type: 'script' | '2d' | '3d';
  video: string | null;
  description: string;
  durationSec: number | null;
  nbUav: number | null;
  tags: string[];
}[];
export { demoPlaystationModels };
