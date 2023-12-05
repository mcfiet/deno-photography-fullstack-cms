export async function getEntries(ctx) {
  const requestFormData = await ctx.request.formData();
  return Object.fromEntries(await requestFormData.entries());
}
