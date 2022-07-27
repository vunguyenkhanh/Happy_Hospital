"use strict";
// import exp from "constants";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProbTS = void 0;
/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ProbTS;
(function (ProbTS) {
    var Prob = /** @class */ (function () {
        /**
         * @param {() => number} rng A function generating numbers randomly within [0, 1) with a uniform distribution
         */
        function Prob(rng) {
            if (rng === void 0) { rng = Math.random; }
            this._rng01 = rng;
            this._rng11 = function () {
                // inspired by https://github.com/ckknight/random-js/blob/master/lib/random.js#L50
                return (((rng() * 0x100000000) | 0) / 0x100000000) * 2;
            };
        }
        Prob.prototype.uniform = function (min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 1; }
            return new UniformDistribution(this._rng01, min, max);
        };
        Prob.prototype.normal = function (mean, sd) {
            if (mean === void 0) { mean = 0; }
            if (sd === void 0) { sd = 1; }
            return new NormalDistribution(this._rng11, mean, sd);
        };
        Prob.prototype.exponential = function (lambda) {
            if (lambda === void 0) { lambda = 1; }
            return new ExponentialDistribution(this._rng01, lambda);
        };
        Prob.prototype.logNormal = function (mu, sigma) {
            if (mu === void 0) { mu = 0; }
            if (sigma === void 0) { sigma = 1; }
            return new LogNormalDistribution(this._rng11, mu, sigma);
        };
        Prob.prototype.poisson = function (lambda) {
            if (lambda === void 0) { lambda = 1; }
            return new PoissonDistribution(this._rng01, lambda);
        };
        Prob.prototype.bimodal = function (lambda) {
            if (lambda === void 0) { lambda = 1; }
            return new BimodalDistribution(this._rng01, lambda);
        };
        return Prob;
    }());
    ProbTS.Prob = Prob;
    var DistributionType;
    (function (DistributionType) {
        DistributionType[DistributionType["Unknown"] = 0] = "Unknown";
        DistributionType[DistributionType["Continuous"] = 1] = "Continuous";
        DistributionType[DistributionType["Discrete"] = 2] = "Discrete";
    })(DistributionType = ProbTS.DistributionType || (ProbTS.DistributionType = {}));
    var UniformDistribution = /** @class */ (function () {
        function UniformDistribution(rng01, min, max) {
            this._rng01 = rng01;
            this._min = min;
            this._max = max;
            this._range = max - min;
            this._mean = min + this._range / 2;
            this._variance = ((max - min) * (max - min)) / 12;
            this._type = DistributionType.Continuous;
        }
        Object.defineProperty(UniformDistribution.prototype, "min", {
            get: function () {
                return this._min;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UniformDistribution.prototype, "max", {
            get: function () {
                return this._max;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UniformDistribution.prototype, "mean", {
            get: function () {
                return this._mean;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UniformDistribution.prototype, "variance", {
            get: function () {
                return this._variance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UniformDistribution.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: false,
            configurable: true
        });
        UniformDistribution.prototype.random = function () {
            return this._min + this._rng01() * this._range;
        };
        return UniformDistribution;
    }());
    ProbTS.UniformDistribution = UniformDistribution;
    var NormalDistribution = /** @class */ (function () {
        function NormalDistribution(rng11, mean, sd) {
            this._rng11 = rng11;
            this._min = Number.NEGATIVE_INFINITY;
            this._max = Number.POSITIVE_INFINITY;
            this._mean = mean;
            this._sd = sd;
            this._variance = sd * sd;
            this._type = DistributionType.Continuous;
            this._y1 = null;
            this._y2 = null;
        }
        Object.defineProperty(NormalDistribution.prototype, "min", {
            get: function () {
                return this._min;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NormalDistribution.prototype, "max", {
            get: function () {
                return this._max;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NormalDistribution.prototype, "mean", {
            get: function () {
                return this._mean;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NormalDistribution.prototype, "variance", {
            get: function () {
                return this._variance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NormalDistribution.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: false,
            configurable: true
        });
        NormalDistribution.prototype.random = function () {
            var M = 1 / (this._sd * Math.sqrt(Math.PI * 2));
            var x = this._rng11() - this.mean;
            var w = Math.exp((-x * x) / (2 * this._variance));
            return M * w;
        };
        return NormalDistribution;
    }());
    ProbTS.NormalDistribution = NormalDistribution;
    var ExponentialDistribution = /** @class */ (function () {
        function ExponentialDistribution(rng01, lambda) {
            this._rng01 = rng01;
            this._min = 0;
            this._max = Number.POSITIVE_INFINITY;
            this._mean = 1 / lambda;
            this._variance = Math.pow(lambda, -2);
            this._type = DistributionType.Continuous;
        }
        Object.defineProperty(ExponentialDistribution.prototype, "min", {
            get: function () {
                return this._min;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ExponentialDistribution.prototype, "max", {
            get: function () {
                return this._max;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ExponentialDistribution.prototype, "mean", {
            get: function () {
                return this._mean;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ExponentialDistribution.prototype, "variance", {
            get: function () {
                return this._variance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ExponentialDistribution.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: false,
            configurable: true
        });
        ExponentialDistribution.prototype.random = function () {
            return -1 * Math.log(this._rng01()) * this._mean;
        };
        return ExponentialDistribution;
    }());
    ProbTS.ExponentialDistribution = ExponentialDistribution;
    var LogNormalDistribution = /** @class */ (function () {
        function LogNormalDistribution(rng11, mu, sigma) {
            this._rng11 = rng11;
            this._min = 0;
            this._max = Number.POSITIVE_INFINITY;
            this._mean = Math.exp(mu + (sigma * sigma) / 2);
            this._variance =
                (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma);
            this._type = DistributionType.Continuous;
            this._nf = new NormalDistribution(rng11, mu, sigma);
        }
        Object.defineProperty(LogNormalDistribution.prototype, "min", {
            get: function () {
                return this._min;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LogNormalDistribution.prototype, "max", {
            get: function () {
                return this._max;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LogNormalDistribution.prototype, "mean", {
            get: function () {
                return this._mean;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LogNormalDistribution.prototype, "variance", {
            get: function () {
                return this._variance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LogNormalDistribution.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: false,
            configurable: true
        });
        LogNormalDistribution.prototype.random = function () {
            return Math.exp(this._nf.random());
        };
        return LogNormalDistribution;
    }());
    ProbTS.LogNormalDistribution = LogNormalDistribution;
    var PoissonDistribution = /** @class */ (function () {
        function PoissonDistribution(rng01, lambda) {
            this._rng01 = rng01;
            this._min = 0;
            this._max = Number.POSITIVE_INFINITY;
            this._mean = lambda;
            this._variance = lambda;
            this._type = DistributionType.Discrete;
            // Knuth's algorithm
            this._L = Math.exp(-lambda);
        }
        Object.defineProperty(PoissonDistribution.prototype, "min", {
            get: function () {
                return this._min;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PoissonDistribution.prototype, "max", {
            get: function () {
                return this._max;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PoissonDistribution.prototype, "mean", {
            get: function () {
                return this._mean;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PoissonDistribution.prototype, "variance", {
            get: function () {
                return this._variance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PoissonDistribution.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: false,
            configurable: true
        });
        PoissonDistribution.prototype.random = function () {
            var k = 0;
            var p = 1;
            while (true) {
                // FIXME This should be [0,1] not [0,1)
                p = p * this._rng01();
                if (p <= this._L) {
                    break;
                }
                k++;
            }
            return p;
        };
        return PoissonDistribution;
    }());
    ProbTS.PoissonDistribution = PoissonDistribution;
    var BimodalDistribution = /** @class */ (function () {
        function BimodalDistribution(rng01, lambda) {
            this._rng01 = rng01;
            this._min = 0;
            this._max = Number.POSITIVE_INFINITY;
            this._mean = lambda;
            this._variance = lambda;
            this._type = DistributionType.Discrete;
            var abs = Math.abs(lambda);
            if (abs < 1 && abs != 0)
                this._p = abs;
            else if (abs == 0)
                this._p = 0.6;
            else
                this._p = 1 / abs;
        }
        Object.defineProperty(BimodalDistribution.prototype, "min", {
            get: function () {
                return this._min;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BimodalDistribution.prototype, "max", {
            get: function () {
                return this._max;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BimodalDistribution.prototype, "mean", {
            get: function () {
                return this._mean;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BimodalDistribution.prototype, "variance", {
            get: function () {
                return this._variance;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BimodalDistribution.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: false,
            configurable: true
        });
        BimodalDistribution.prototype.random = function () {
            var N = 3628800; //n!
            var x = Math.floor(this._rng01() * 9);
            var px = Math.pow(this._p, x);
            var qx = Math.pow(1 - this._p, 10 - x);
            var M = 1;
            for (var i = 1; i <= x; i++) {
                M = M * i * (10 - i);
            }
            return (N / M) * px * qx;
        };
        return BimodalDistribution;
    }());
    ProbTS.BimodalDistribution = BimodalDistribution;
})(ProbTS = exports.ProbTS || (exports.ProbTS = {}));
//# sourceMappingURL=prob.js.map