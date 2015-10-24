var sequelize = require('../../config/sequelize').getSequelize(),
    Area = sequelize.model('Area');

function criarObjetoArea() {
    return {
        area: 'Informatica'
    };
}

function verificarAreaValida(res) {
    expect(res.body)
        .to.be.an('object')
        .and.to.have.all.keys(['id', 'area', 'createdAt', 'updatedAt']);
}

describe('API Area', function () {
    
    beforeEach(function (done) {
        Area.destroy({truncate:true})
            .finally(done);
    });
    
    describe('Métodos CRUD', function() {
        it('Nova Area', function(done) {
            request(express)
                .post('/api/areas')
                .send(criarObjetoArea())
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(verificarAreaValida)
                .end(done);
        });

        it('Exibir Area', function(done) {
            Area.create(criarObjetoArea())
                .then(function(area) {
                    request(express)
                        .get('/api/areas/' + area.get('id'))
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect(verificarAreaValida)
                        .end(done)
                })
                .catch(done);
        });
        
        it('Editar Area', function(done) {
            Area.create(criarObjetoArea())
                .then(function(area) {
                    request(express)
                        .put('/api/areas/' + area.get('id'))
                        .send({area: 'Teste'})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect(verificarAreaValida)
                        .expect(function(res) {
                            expect(res.body.area)
                                .to.be.equal('Teste');
                        })
                        .end(done)
                })
                .catch(done);
        });
        
        it('Excluir Area', function(done) {
            Area.create(criarObjetoArea())
                .then(function(area) {
                    request(express)
                        .delete('/api/areas/' + area.get('id'))
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
        
        it('Listar Areas', function(done) {
            Area.create(criarObjetoArea())
                .then(function(area) {
                    request(express)
                        .get('/api/areas')
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
        it('Retornar erro de validação quando a area tiver um tamanho maior que o maximo.',
            function (done) {
                var dadosArea = criarObjetoArea();
                dadosArea.area = 'abcdefgijklmnopqrstuvxzzzzzzzzzzzzzzzzzz';

                apiUtil.criarJsonPost('/api/areas', dadosArea, 400)
                    .expect(apiUtil.verificarErroApi('ErroValidacao'))
                    .end(done);
            }
        );

        it('Retornar erro de validação quando os campos não nulos não forem enviados.',
            function (done) {
                var areaEmBranco = {};

                apiUtil.criarJsonPost('/api/Areas', areaEmBranco, 400)
                    .expect(apiUtil.verificarErroApi('ErroValidacao', 4))
                    .end(done);
            }
        );

    });

});