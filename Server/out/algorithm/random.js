"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomDistribution = void 0;
var prob_1 = require("./prob");
var RandomDistribution = /** @class */ (function () {
    function RandomDistribution() {
    }
    RandomDistribution.prototype.getProbability = function () {
        var Prob = new prob_1.ProbTS.Prob();
        var ran = Math.random();
        switch (Math.floor(ran * 4)) {
            case 0:
                var poisson = Prob.poisson(); //Math.random();
                this._name = 'Poisson';
                return poisson.random();
            case 1:
                var uniform = Prob.uniform(0, 1);
                this._name = 'Uniform';
                return uniform.random();
            case 2:
                this._name = 'Bimodal';
                var bimodal = Prob.bimodal();
                return bimodal.random();
        }
        this._name = 'Normal';
        var normal = Prob.normal();
        return normal.random();
    };
    RandomDistribution.prototype.getName = function () {
        return this._name;
    };
    return RandomDistribution;
}());
exports.RandomDistribution = RandomDistribution;
//# sourceMappingURL=random.js.map