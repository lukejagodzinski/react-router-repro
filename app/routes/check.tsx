export async function loader() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return null;
}
