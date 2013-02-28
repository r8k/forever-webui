var app = require('../app').app,
	request = require('supertest'),
	should = require('should'),
	spawn = require('child_process').spawn;

describe('Forever Start', function(){
	describe('Starting a Process w/ Forever: ', function(){
		this.timeout(5000);
		var UID = null;
		beforeEach(function () {
			this.child = spawn("forever", ['./test/fixtures/testProcessRun.js']);
			this.bail = true;
			request = require('supertest')
		});

		afterEach(function () {
			this.child = spawn("forever", ['stop 0']);
		})

		it('should display it in webUI', function(done){
			setTimeout(function () {
				request = request('http://localhost:8085');
				request
					.get('/processes')
					.expect(200)
					.end(function (err, res) {
						UID = JSON.parse(res.text)[0].uid;
				  		JSON.parse(res.text)[0].should.include({
			  				file: 'test/fixtures/testProcessRun.js'
			  			});
			  			done();
					});
			}, 2000);
		});

		it('should stop after stopped from webUI', function(done){
			setTimeout(function () {
				request = request('http://localhost:8085');
				request
					.get('/stop/' + UID)
					.expect(200)
					.end(function (err, res) {
				  		JSON.parse(res.text).should.include({
			  				status: 'success',
			  				details: true
			  			});
			  			done();
					});
			}, 2000);
		});
	});
});