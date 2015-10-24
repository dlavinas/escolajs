var sequelize = require('../../config/sequelize').getSequelize(),
    Curso = sequelize.model('Curso');

function criarObjetoCurso() {
    return {
        curso: 'Português',
        sigla: 'PT'
    };
}

function verificarCursoValido(res) {
    expect(res.body)
        .to.be.an('object')
        .and.to.have.all.keys(['id', 'curso', 'sigla', 'createdAt', 'updatedAt', 'areaId']);
}

function verificarNovoCursoValido(res) {
    expect(res.body)
        .to.be.an('object')
        .and.to.have.all.keys(['id', 'curso', 'sigla', 'createdAt', 'updatedAt']);
}

describe('API Cursos', function () {

    beforeEach(function (done) {
        Curso.destroy({truncate: true})
            .finally(done);
    });

    describe('Métodos CRUD', function () {
        it('Novo Curso', function (done) {
            request(express)
                .post('/api/cursos')
                .send(criarObjetoCurso())
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(verificarNovoCursoValido)
                .end(done);
        });

        it('Exibir Curso', function (done) {
            Curso.create(criarObjetoCurso())
                .then(function (curso) {
                    request(express)
                        .get('/api/cursos/' + curso.get('id'))
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect(verificarCursoValido)
                        .end(done)
                })
                .catch(done);
        });

        it('Editar Curso', function (done) {
            Curso.create(criarObjetoCurso())
                .then(function (curso) {
                    request(express)
                        .put('/api/cursos/' + curso.get('id'))
                        .send({curso: 'Matematica'})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect(verificarCursoValido)
                        .expect(function (res) {
                            expect(res.body.curso)
                                .to.be.equal('Matematica');
                        })
                        .end(done)
                })
                .catch(done);
        });

        it('Excluir Curso', function (done) {
            Curso.create(criarObjetoCurso())
                .then(function (curso) {
                    request(express)
                        .delete('/api/cursos/' + curso.get('id'))
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect(function (res) {
                            expect(res.body)
                                .to.be.true;
                        })
                        .end(done)
                })
                .catch(done);
        });

        it('Listar Cursos', function (done) {
            Curso.create(criarObjetoCurso())
                .then(function (curso) {
                    request(express)
                        .get('/api/cursos')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect(function (res) {
                            expect(res.body)
                                .to.be.an('array')
                                .and.have.length(1);
                        })
                        .end(done)
                })
                .catch(done);
        });
    });
    
    describe('Validação', function() {
        it('Retornar erro de validação quando o nome do curso exceder o limite máximo.',
            function (done) {
                var dadosCurso = criarObjetoCurso();
                dadosCurso.curso = '1234567890qwertyuiop1234567890qwertyuiop1234567890qwertyuiop1234567890qwertyuiop1234567890qwertyuiopzzz';

                apiUtil.criarJsonPost('/api/cursos', dadosCurso, 400)
                    .expect(apiUtil.verificarErroApi('ErroValidacao'))
                    .end(done);
            }
        );

        it('Retornar erro de validação quando os campos não nulos não forem enviados.',
            function (done) {
                var cursoEmBranco = {};

                apiUtil.criarJsonPost('/api/professores', cursoEmBranco, 400)
                    .expect(apiUtil.verificarErroApi('ErroValidacao', 4))
                    .end(done);
            }
        );
        
        it('Retornar erro de validação quando a sigla do curso exceder o limite máximo.',
            function (done) {
                var dadosCurso = criarObjetoCurso();
                dadosCurso.sigla = '1234567890qwertyuiopzzz';

                apiUtil.criarJsonPost('/api/cursos', dadosCurso, 400)
                    .expect(apiUtil.verificarErroApi('ErroValidacao'))
                    .end(done);
            }
        );
        
    });

});