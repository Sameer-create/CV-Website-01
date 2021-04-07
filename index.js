const express = require('express');
const pdf = require('html-pdf')
const expressEjsLayouts = require('express-ejs-layouts');
const dynamicResume = require('./docs/dynamic-resume');
const { req} = require('express');

const app = express()


app.set('view engine', 'ejs');
app.use(expressEjsLayouts)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

const options ={
"height": "6.3in",        // allowed units: mm, cm, in, px
"width": "4.9in", 
}

app.get('/', (req,res)=>{
    res.render('home')
})
app.get('/resume-maker/:theme',(req,res)=>{
    console.log('theme: ',req.params.theme);
    switch(req.params.theme){
        case '1':
        res.render('resume-maker',{theme: "light"});
        break;
        case '2':
        res.render('resume-maker',{theme: "dark"});
        break;
        default:
        res.render('resume-maker',{theme: "dark"});
        break;
    }
})

app.post('/resume-maker',(req,res,next)=>{
    console.log(req.body);
    //Lowercase => remove space => shortname
    const userName = req.body.name;
    const lowercaseName = userName.toLowerCase();
    const noSpaceName = lowercaseName.replace(' ','');
    const shortName = noSpaceName.slice(0,10);
    console.log('short name: ', shortName);

let themeOptions={
    leftTextColor: "rgb(91, 88, 255)",
    leftBackgroundColor: '#867979',
    wholeBodyColor: 'rgb(255,255,255)',
    rightTextColor: 'rgb(211,211,211)'
};

if(req.body.theme === 'light'){
    //HTML TO PDF CONVERSION
pdf.create(dynamicResume(req.body,themeOptions),options).toFile(__dirname+"/docs/"+ shortName + "-resume.pdf" ,(error, response)=>{
    if(error) throw Error("file is not created");
    console.log(response.filename);
    res.sendFile(response.filename);
  });
} else if(req.body.theme === 'Dark'){
    themeOptions={
        leftTextColor: " rgb(91, 88, 255)",
        leftBackgroundColor: '#867979',
        wholeBodyColor: '#a3a375',
        rightTextColor: '#a3a375'
    };
    //HTML TO PDF CONVERSION
pdf.create(dynamicResume(req.body,themeOptions),options).toFile(__dirname+"/docs/"+ shortName + "-resume.pdf" ,(error, response)=>{
    if(error) throw Error("file is not created");
    console.log(response.filename);
    res.sendFile(response.filename);
  });
}
else{
    //SETTING DEFAULT VALUE
    //HTML TO PDF CONVERSION
pdf.create(dynamicResume(req.body,themeOptions),options).toFile(__dirname+"/docs/"+ shortName + "-resume.pdf" ,(error, response)=>{
    if(error) throw Error("file is not created");
    console.log(response.filename);
    res.sendFile(response.filename);
  });
}
});

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log('server is running on : '+ port)); 