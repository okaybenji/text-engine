const logo =
`            █████████ ███████  ██   ██  █████████               
              ██    ██        ██ ██       ██                  
              ██   █████     ███      ██   █████            
              ██   ██       ██ ██     ██                  
              ██   ███████  ██   ███    ██                  

         ███████  ███   ██   ██████   ██  ███  ███  ███████ 
         ██       ████  ██  ██        ██  ████  ██  ██      
         █████   ██ ██  ██  ██  ████  ██  ██ ██ ██  █████   
         ██     ██  ██ ██  ██   ██  ██  ██  ██ ██  ██      
         ███████  ██   ████   ██████   ██  ██  ████  ███████
`.split('').reduce((image, char) => {
  // Preserve spaces.
  if (char === ' ') {
    return image + char + '\u00A0';
  }
  // Preserve backslashes.
  if (char === '\\') {
    return image + char + '\\';
  }

  return image + char;
}, '');

const logoElement = document.createElement('code');
logoElement.classList.add('img');
document.querySelector('#output').appendChild(logoElement).innerText = logo;
