//para ejecutarlo npm test
const request = require('supertest');
const app = require('../app');

let adminToken;

describe('Pruebas de las rutas de comercio', () => {
    // Test para registrar un nuevo admin
    it('debería registrar un nuevo admin', async () => {
        const response = await request(app)
            .post('/api/usuario/register')
            .send({
                "nombreUsuario": "AdminPrueba",
                "email": "AdminPrueba@gmail.com",
                "contrasenia": "miContrasenia",
                "edad": 1,
                "ciudad": "Madrid",
                "intereses": ["Comida", "Videojuegos"],
                "permiteRecibirOfertas": true,
                "rol": "admin"
            })
            .set('Accept', 'application/json')
            .expect(200);

        // Almacena el token del admin registrado
        adminToken = response.body.token;
        expect(response.body.data.email).toEqual("AdminPrueba@gmail.com");
        expect(adminToken).toBeDefined();
    });

    it('debería obtener todos los comercios', async () => {
        const response = await request(app)
            .get('/api/comercio/')
            .expect(200);
        expect(response.body).toBeDefined();
    });

    it('debería obtener un comercio por su CIF', async () => {
        const response = await request(app)
            .get(`/api/comercio/A1111111A`)
            .expect(200);
        //podria hacer mas comprobaciones pero si el cif es el correcto el resto de los dato se por seguro que tambien
        expect(response.body.cif).toEqual("A1111111A")
    });

    it('debería registrar un nuevo comercio', async () => {
        const response = await request(app)
            .post('/api/comercio/register')
            .send({
                "nombre": "ComercioPrueba",
                "cif": "A1111133A",
                "direccion": "Alonso Cano, 94",
                "email": "ComercioPrueba@gmail.com",
                "telefonoContacto": "123456789",
                "contrasenia": "miContrasenia",
                "ciudad": "Madrid",
                "actividad": "Alquiler"
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        //consideramos que dado que siguen el mismo proceso pero ademas el cif ha de ser unico si el cif esta correcto lo demas tambien
        expect(response.body.dataFinal.cif).toEqual("A1111133A");
        //no se cual es el token pero se que existe
        expect(response.body.token).toBeDefined();
    });

    it('debería autenticar un comercio', async () => {
        const response = await request(app)
            .post('/api/comercio/login')
            .send({
                "cif": "A1111133A",
                "contrasenia": "miContrasenia"
            })
            .set('Accept', 'application/json')
            .expect(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.data.cif).toEqual("A1111133A");
    });

    it('debería actualizar un comercio existente', async () => {
        const response = await request(app)
            .put(`/api/comercio/A1111133A`)
            .send({
                "nombre": "ComercioPruebaAlterado",
                "cif": "A1111133A",
                "direccion": "Alonso Cano, 91",
                "email": "ComercioPruebaAlterado@gmail.com",
                "telefonoContacto": "722684559",
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        //compruebo que el cif no cambia + un dato que si haya modificado
        expect(response.body.cif).toEqual("A1111133A");
        expect(response.body.nombre).toEqual("ComercioPruebaAlterado");

    });

    it('debería añadir reseñas a un comercio', async () => {
        const response = await request(app)
            .put(`/api/comercio/resenias/A1111133A`)
            .send({
                "cif": "A1111133A",
                "resenias": ["Nueva resenia test"],
                "scoring": 2
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        //tendria q comprobar que el score ha cambiado (pero hago la media con los anteriores asi q no tengo con q valor comparar)
        //asi que solo comprobare que la reseña a sido añadida
        expect(response.body.scoring).toBeDefined();
        expect(response.body.resenias).toContain("Nueva resenia test");
    });

    it('debería eliminar un comercio existente', async () => {
        const response = await request(app)
            .delete(`/api/comercio/A1111133A`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        //compruebo que el cif esta en la respuesta, ya que devolvemos el objeto eliminado
        expect(response.body.cif).toEqual("A1111133A");
    });

    it('debería obtener comercios por ciudad', async () => {
        const response = await request(app)
            .get(`/api/comercio/ciudad/Madrid`)
            .expect(200);
        //como hay varios objetos no puedo comprobar todos (podria comprobar que todos tengan ciudad madrid, pero no tiene sentido comprobar otros datos)
        expect(response.body).toBeDefined();
    });

    it('debería obtener comercios por actividad', async () => {
        const response = await request(app)
            .get(`/api/comercio/actividad/Comida Rapida`)
            .expect(200);
        expect(response.body).toBeDefined();
    });

    it('debería obtener comercios por ciudad y actividad', async () => {
        const response = await request(app)
            .get(`/api/comercio/ciudad/Madrid/actividad/Comida Rapida`)
            .expect(200);
        expect(response.body).toBeDefined();
    });
});

describe('Pruebas de las rutas de usuario', () => {
    it('debería obtener todos los usuarios', async () => {
        const response = await request(app)
            .get('/api/usuario/')
            .expect(200);
        expect(response.body).toBeDefined();
    });

    it('debería obtener un usuario por su email', async () => {
        const response = await request(app)
            .get(`/api/usuario/Usuario1@gmail.com`)
            .expect(200);
        expect(response.body.email).toEqual("Usuario1@gmail.com");
    });

    let userToken;
    it('debería registrar un nuevo usuario', async () => {
        const response = await request(app)
            .post('/api/usuario/register')
            .send({
                "nombreUsuario": "UserPrueba",
                "email": "UsuarioPrueba@gmail.com",
                "contrasenia": "miContrasenia",
                "edad": 1,
                "ciudad": "Madrid",
                "intereses": ["Comida", "Videojuegos"],
                "permiteRecibirOfertas": true,
                "rol": "user"
            })
            .set('Accept', 'application/json')
            .expect(200);
        userToken = response.body.token
        expect(response.body.data.email).toEqual("UsuarioPrueba@gmail.com");
        expect(response.body.token).toBeDefined();
    });

    it('debería autenticar un usuario', async () => {
        const response = await request(app)
            .post('/api/usuario/login')
            .send({
                    "email": "UsuarioPrueba@gmail.com",
                    "contrasenia": "miContrasenia"
            })
            .set('Accept', 'application/json')
            .expect(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.data.email).toEqual("UsuarioPrueba@gmail.com");
    });

    it('debería actualizar un usuario existente', async () => {
        const response = await request(app)
            .put(`/api/usuario/UsuarioPrueba@gmail.com`)
            .send({
                "nombreUsuario": "UsuarioPruebaModificado",
                "email": "UsuarioPrueba@gmail.com",
                "ciudad": "Berlin",
                "intereses": ["Compras","Videojuego"],
                "permiteRecibirOfertas": true,
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);
        //compruebo el email no cambia
        expect(response.body.email).toEqual("Usuario2@gmail.com");
        //compruebo que alguno de los alterados si que cambia
        expect(response.body.nombreUsuario).toEqual("UsuarioPrueba");

    });

    it('debería eliminar un usuario existente', async () => {
        const response = await request(app)
            .delete(`/api/usuario/Usuario2@gmail.com`)
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjRjZGJjYmVlNmM4Y2M2YmM2OTA0MTciLCJlbWFpbCI6IlVzdWFyaW8yQGdtYWlsLmNvbSIsImlhdCI6MTcxNjMxMzIyMSwiZXhwIjoxNzE2MzIwNDIxfQ.WHAixlVnVrnKhr1b0Ssf33YLwM6YHizkodVzO5G94cQ')
            .expect(200);
        expect(response.body.email).toEqual("Usuario2@gmail.com");
    });

    it('debería obtener usuarios por intereses y ciudad del comercio', async () => {
        const response = await request(app)
            .get(`/api/usuario/cif/A3333333A/intereses/Videojuegos`)
            .expect(200);
        //como puede haber muchas respuestas como mucho podria confirmar que la ciudad y videojuegos conciden
        expect(response.body).toBeDefined();
    });
});
