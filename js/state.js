export const state = {
  uploadedImg: null,
  currentTool: 'zoom',
  isDrawing: false,
  startX: 0,
  startY: 0,
  measurements: [],
  annotations: [],
  pixPerUm: 2.5,

  reset() {
    this.measurements = [];
    this.annotations = [];
  },
};
