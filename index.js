require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/

// Ruta para la página de inicio - mostrar lista de verduras
app.get('/', async (req, res) => {
    try {
        // 1. Configurar la llamada a la API de HubSpot
        const objectType = '2-48912539'; // ID de tu objeto personalizado "verduras"
        const properties = 'nombre,tipo_de_verdura'; // Las 3 propiedades que creaste
        
        // 2. Hacer GET request a HubSpot API
        const response = await axios.get(`https://api.hubapi.com/crm/v3/objects/${objectType}`, {
            headers: {
                'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            params: {
                properties: properties,
                limit: 10 // Máximo de registros a obtener
            }
        });
        
        // 3. Extraer los datos de la respuesta
        const verduras = response.data.results;
        
        // 4. Renderizar la plantilla homepage con los datos
        res.render('homepage', {
            pageTitle: 'Lista de Verduras | Integración con HubSpot I Practicum',
            verduras: verduras
        });
        
    } catch (error) {
        // 5. Manejo de errores
        console.error('Error al obtener verduras:', error.response?.data || error.message);
        res.render('homepage', {
            pageTitle: 'Lista de Verduras | Error',
            verduras: [],
            error: 'Error al cargar las verduras'
        });
    }
});

app.get('/update-cobj', (req,res)=>{
    res.render('updates', {
        pageTitle: 'Actualizar Formulario de objeto personalizado | Integración con HubSpot'
    });
});

// Ruta POST para procesar el formulario y crear nueva verdura
app.post('/update-cobj', async (req, res) => {
    try {
        // 1. Obtener los datos del formulario
        const { nombre, tipo_de_verdura } = req.body;
        
        // 2. Preparar los datos para HubSpot
        const newVerdura = {
            properties: {
                "nombre": nombre,
                "tipo_de_verdura": tipo_de_verdura
            }
        };
        
        // 3. Hacer POST request a HubSpot API
        const objectType = '2-48912539';
        const response = await axios.post(`https://api.hubapi.com/crm/v3/objects/${objectType}`, newVerdura, {
            headers: {
                'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Nueva verdura creada:', response.data);
        
        // 4. Redirigir a la página principal
        res.redirect('/');
        
    } catch (error) {
        console.error('Error al crear verdura:', error.response?.data || error.message);
        // En caso de error, redirigir de vuelta al formulario
        res.redirect('/update-cobj');
    }
});



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));