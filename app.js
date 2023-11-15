// importar los paquetes
import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import morgan from "morgan"
import dotenv from "dotenv"




const app=express()
// app.set(parametro1,parametro 2) dos parametros para el motor de plantilla
app.set('view engine','ejs')
//midleware
//analiza los dadatos codificados en la url y en el cuerpo de la solicitud
app.use(bodyParser.urlencoded({extende:true}))
app.use(morgan('dev'))
app.use(express.static('public'))

dotenv.config()
//coneccion del mongodb
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("coneccion al mongo");
})
.catch((error)=>{
    console.error("error de coneccion ", error);
})


const itemSchema={
    nombre:String
}
const Item =mongoose.model('Item',itemSchema)

const item1=new Item({nombre:'Ir al doctor'})
const item2=new Item({nombre:'Ir a comprar'})
const item3=new Item({nombre:'Ir al gimnasio'})

const defaultItems=[item1,item2,item3]

/*Item.insertMany(defaultItems)
            .then(function(){
                      console.log('se guardo los datos')
             })
            .catch(function(error){

                       console.log(error)
              })*/

//rutaas
app.get('/',(req,res)=>{
    //res.render(parametro1,parametro2)
    Item.find({})
    .then(function(foundItems){
        if(foundItems.length===0){

            Item.insertMany(defaultItems)/*insertMany es una función o método utilizado en bases de datos y sistemas de gestión de bases de datos (DBMS) para insertar múltiples documentos o registros en una colección o tabla al mismo tiempo.

            En términos generales, una colección en una base de datos noSQL o una tabla en una base de datos relacional está compuesta por varios documentos o registros individuales. La función insertMany permite insertar varios de estos documentos o registros a la vez, en lugar de tener que realizar inserciones individuales una por una.
            
            La sintaxis y el uso específicos pueden variar según el DBMS y el lenguaje de programación utilizado, pero en general, se proporciona un arreglo o lista de documentos o registros como argumento a la función insertMany. Cada documento o registro debe estar estructurado de acuerdo con el formato esperado por el DBMS y la colección o tabla específica.
            
            La función insertMany es útil cuando se tienen varios datos para insertar en una colección o tabla al mismo tiempo, lo que puede mejorar la eficiencia y el rendimiento de la inserción de datos en la base de datos.*/
            console.log('se guardo los datos')
            res.redirect('/')
        }else{
            console.log(foundItems)
            res.render('list',{listTitle:'Mi app To Do list', newListItems: foundItems})
        }

    })
    .catch(function(error){

        console.log(error)
})
   
})

app.post("/",(req,res)=>{
const nuevoItem = req.body.nuevoItems
const item= new Item({nombre:nuevoItem})
item.save()
console.log("se guardaron los datos")
res.redirect('/') //para volver y agregar los datos devbuelta a la pagina

})

app.post("/delete",(req,res)=>{
const idDelet= req.body.items
console.log(idDelet)
Item.findByIdAndRemove(idDelet)
.then(function(id){
if(id){
    console.log('se borro el dato')
    res.redirect('/')
}

})




})




app.listen(3030,()=>{

    console.log('servidor ejecutandose')
})
