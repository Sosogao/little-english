module.exports = async function handler(request, response) {
  const module = await import('../apps/web/api/tts.js');
  return module.default(request, response);
};
