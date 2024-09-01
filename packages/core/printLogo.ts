export default function () {
  if (PROD) {
    const logo = `
  ________________________________________________________________________________
  
 ________                        _______  __                                 __   
|  |  |  |.---.-..-----. ______ |    ___||  |.-----..--------..-----..-----.|  |_ 
|  |  |  ||  _  ||     ||______||    ___||  ||  -__||        ||  -__||     ||   _|
|________||___._||__|__|        |_______||__||_____||__|__|__||_____||__|__||____|
                                                                                  
  ________________________________________________________________________________
                                   author:WangMov
  `;

    const rainbowGradient = `
  background: linear-gradient(135deg, orange 60%, cyan);
  background-clip: text;
  color: transparent;
  font-size: 16px; 
  line-height: 1;
  font-family: monospace;
  font-weight: 600;
  `;

    console.info(`%c${logo}`, rainbowGradient);
  } else if (DEV) {
    console.log("[Wan-Element]:dev mode...");
  }
}
