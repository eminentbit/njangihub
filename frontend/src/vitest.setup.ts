// import "@testing-library/jest-dom";

global.FileList = class FileList extends Array<File> {
  item(index: number) {
    return this[index] || null;
  }
};
