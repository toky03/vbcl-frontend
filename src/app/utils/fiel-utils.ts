export function createLink(filename: string, data: string) {
  var element = document.createElement('a');
  element.setAttribute('href', data);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
