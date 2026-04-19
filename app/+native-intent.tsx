export function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}) {
  console.log("[native-intent]", { path, initial });
  return "/";
}
