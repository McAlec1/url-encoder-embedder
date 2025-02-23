function createEmbedElement(url, type) {
  const element = document.createElement(type);
  element.src = url;
  element.width = '100%';
  element.height = '100%';
  return element;
}
function getElementHtml(url, type) {
  return `<${type} src="${url}" width="100%" height="100%" style="border:none;"><p>Your browser does not support embeds/iframes.</p></${type}>`;
}
function createMinifiedHtml(url, type) {
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="background-color:black;margin:0;">${getElementHtml(url, type)}</body></html>`;
}
function createRegularDataUrl(url, type) {
  return `data:text/html,<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="background-color:black;margin:0;">${getElementHtml(url, type)}</body>`;
}
function createEncodedDataUrl(url, type) {
  const html = `<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="background-color:black;margin:0;">${getElementHtml(url, type)}</body>`;
  return `data:text/html,${encodeURIComponent(html)}`;
}
function createBase64DataUrl(url, type) {
  const html = `<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="background-color:black;margin:0;">${getElementHtml(url, type)}</body>`;
  return `data:text/html;base64,${btoa(html)}`;
}
function createAboutBlankMethod(url, type) {
  return {
    code: `javascript:(function(){
        var win = window.open('about:blank');
        var ${type} = win.document.createElement('${type}');
        ${type}.src = '${url}';
        ${type}.style.width = '100%';
        ${type}.style.height = '100%';
        ${type}.style.border = 'none';
        win.document.body.style.margin = '0';
        win.document.body.appendChild(iframe);
      })()`,
    href: `javascript:(function(){var win=window.open('about:blank');var ${type}=win.document.createElement('${type}');${type}.src='${url}';${type}.style.width='100%';${type}.style.height='100%';${type}.style.border='none';win.document.body.style.margin='0';win.document.body.appendChild(${type});})()`
  };
}
function clearPreviews() {
  const elements = [
    'regularResult',
    'regularCode',
    'minifiedResult',
    'minifiedPreview',
    'dataUrlResult',
    'dataUrlPreview',
    'encodedDataUrlResult',
    'encodedDataUrlPreview',
    'base64Result',
    'base64Preview',
    'blankResult',
    'blankPreview'
  ];
  elements.forEach(id => {
    document.getElementById(id).innerHTML = '';
  });
}
function processUrl(input) {
  input = input.trim();
  try {
    new URL(input);
    return input;
  } catch {}
  const domainPattern = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  if (domainPattern.test(input)) {
    return `https://${input}`;
  }
  if (input.startsWith('www.')) {
    return `https://${input}`;
  }
  if (input.includes('.') && !input.includes(' ') && !input.includes('http')) {
    return `https://${input}`;
  }
  return null;
}
function updateQueryString(url) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('url', url);
  window.history.pushState({}, '', newUrl);
}
function generateAll() {
  const urlInput = document.getElementById('urlInput').value;
  const url = processUrl(urlInput);
  const type = document.querySelector('input[name="embedType"]:checked').value;
  if (!url) {
    alert('Please enter a valid URL');
    return;
  }
  updateQueryString(url);
  clearPreviews();
  const regularElement = createEmbedElement(url, type);
  document.getElementById('regularResult').appendChild(regularElement);
  document.getElementById('regularCode').textContent = getElementHtml(url, type);
  const minifiedHtml = createMinifiedHtml(url, type);
  document.getElementById('minifiedResult').textContent = minifiedHtml;
  const minifiedElement = createEmbedElement(url, type);
  document.getElementById('minifiedPreview').appendChild(minifiedElement);
  const dataUrl = createRegularDataUrl(url, type);
  document.getElementById('dataUrlResult').textContent = dataUrl;
  const dataUrlElement = createEmbedElement(dataUrl, type);
  document.getElementById('dataUrlPreview').appendChild(dataUrlElement);
  const encodedDataUrl = createEncodedDataUrl(url, type);
  document.getElementById('encodedDataUrlResult').textContent = encodedDataUrl;
  const encodedDataUrlElement = createEmbedElement(encodedDataUrl, type);
  document.getElementById('encodedDataUrlPreview').appendChild(encodedDataUrlElement);
  const base64DataUrl = createBase64DataUrl(url, type);
  document.getElementById('base64Result').textContent = base64DataUrl;
  const base64Element = createEmbedElement(base64DataUrl, type);
  document.getElementById('base64Preview').appendChild(base64Element);
  
  const blankMethod = createAboutBlankMethod(url, type);
  document.getElementById('blankResult').textContent = blankMethod.code;
  document.getElementById('blankPreview').innerHTML = `
    <a href="${blankMethod.href}" class="about-blank-link">Open in about:blank window</a>
    <p><small>Note: Some browsers may block pop-ups. Enable pop-ups for this site if needed.</small></p>
  `;
}
document.getElementById('urlInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
      generateAll();
  }
});
window.onload = function() {
  const urlParam = urlParams.get('url');
  if (urlParam) {
    document.getElementById('urlInput').value = urlParam;
  }
  generateAll();
};