export class Vector {
    constructor(_x, _y) {
        this.x = _x
        this.y = _y
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y)
    }
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y)
    }
    multiply(n) {
        return new Vector(this.x * n, this.y * n)
    }
    mag() {
        return Math.sqrt(this.x**2 + this.y**2)
    }
    normal() {
        return new Vector(-this.y, this.x).unit()
    }
    unit() {
        return this.mag !== 0 ? new Vector(this.x / this.mag(), this.y / this.mag()) : new Vector(0, 0)
    }
    
}