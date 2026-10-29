const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:900,height:1080},deviceScaleFactor:5});
await p.goto('file://'+__dirname+'/designs.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
for (const id of ['ruta','pajero','acm']){await (await p.$('#'+id)).screenshot({path:`${id}.png`,omitBackground:true});}
for (const [c,n] of [['#F5F7FA','pecho-blanco'],['#080A0F','pecho-negro']]){await p.evaluate(c=>document.getElementById('pecho').style.color=c,c);await (await p.$('#pecho')).screenshot({path:`${n}.png`,omitBackground:true});}
await b.close();})();
