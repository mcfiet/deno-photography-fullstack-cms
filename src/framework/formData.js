export async function getEntries(ctx) {
  const requestFormData = await ctx.request.formData();
  return Object.fromEntries(await requestFormData.entries());
}

export async function getAll(formData, name) {
  return formData.getAll(name);
}

export async function getFormData(ctx) {
  return await ctx.request.formData();
}
