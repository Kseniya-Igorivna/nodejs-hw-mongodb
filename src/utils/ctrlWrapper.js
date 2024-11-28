export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      console.error('Controller error:', err);
      next(err);
    }
  };
};
