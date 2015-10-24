var sequelize = require('../../config/sequelize').getSequelize(),
    Turma = sequelize.model('Turma');

function criarObjetoTurma() {
    return {
        sigla: 'ADS-5-2015-2',
        ano: '2015',
        semestre: '2'
    };
}

function verificarTurmaValida(res) {
    expect(res.body)
        .to.be.an('object')
        .and.to.have.all.keys(['id', 'cursoId', 'sigla', 'ano', 'semestre', 'createdAt', 'updatedAt']);
}

function verificarNovaTurmaValida(res) {
    expect(res.body)
        .to.be.an('object')
        .and.to.have.all.keys(['id', 'sigla', 'ano', 'semestre', 'createdAt', 'updatedAt']);
}

describe('API Turma', function () {
    
    beforeEach(function (done) {
        Turma.destroy({truncate:true})
            .finally(done);
    });
    
    describe('Métodos CRUD', function() {
        it('Nova Turma', function(done) {
            request(express)
                .post('/api/turmas')
                .send(criarObjetoTurma())
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(verificarNovaTurmaValida)
                .end(done);
        });

        it('Exibir Turma', function(done) {
            Turma.create(criarObjetoTurma())
                .then(function(turma) {
                    request(express)
                        .get('/api/turmas/' + turma.get('id'))
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect(verificarTurmaValida)
                        .end(done)
                })
                .catch(done);
        });
        
        it('Editar Turma', function(done) {
            Turma.create(criarObjetoTurma())
                .then(function(turma) {
                    request(express)
                        .put('/api/turmas/' + turma.get('id'))
                        .send({semestre: '1'})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect(verificarTurmaValida)
                        .expect(function(res) {
                            expect(res.body.semestre)
                                .to.be.equal('1');
                        })
                        .end(done)
                })
                .catch(done);
        });
        
        it('Excluir Turma', function(done) {
            Turma.create(criarObjetoTurma())
                .then(function(turma) {
                    request(express)
                        .delete('/api/turmas/' + turma.get('id'))
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect(function(res) {
                            expect(res.body)
                                .to.be.true;
                        })
                        .end(done)
                })
                .catch(done);
        });
        
        it('Listar Turmas', function(done) {
            Turma.create(criarObjetoTurma())
                .then(function(turma) {
                    request(express)
                        .get('/api/turmas')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect(function(res) {
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
        it('Retornar erro de validação quando a sigla tiver um tamanho maior que o maximo.',
            function (done) {
                var dadosTurma = criarObjetoTurma();
                dadosTurma.sigla = 'abcdefgijklmnopqrstuvxzzzzzzzzzzzzzzzzzz';

                apiUtil.criarJsonPost('/api/turmas', dadosTurma, 400)
                    .expect(apiUtil.verificarErroApi('ErroValidacao'))
                    .end(done);
            }
        );

        it('Retornar erro de validação quando a ano tiver um tamanho maior que o maximo.',
            function (done) {
                var dadosTurma = criarObjetoTurma();
                dadosTurma.ano = '12345';

                apiUtil.criarJsonPost('/api/turmas', dadosTurma, 400)
                    .expect(apiUtil.verificarErroApi('ErroValidacao'))
                    .end(done);
            }
        );

        it('Retornar erro de validação quando a semestre tiver um tamanho maior que o maximo.',
            function (done) {
                var dadosTurma = criarObjetoTurma();
                dadosTurma.sigla = '11';

                apiUtil.criarJsonPost('/api/turmas', dadosTurma, 400)
                    .expect(apiUtil.verificarErroApi('ErroValidacao'))
                    .end(done);
            }
        );

        it('Retornar erro de validação quando os campos não nulos não forem enviados.',
            function (done) {
                var turmaEmBranco = {};

                apiUtil.criarJsonPost('/api/Turmas', turmaEmBranco, 400)
                    .expect(apiUtil.verificarErroApi('ErroValidacao', 4))
                    .end(done);
            }
        );

    });

});