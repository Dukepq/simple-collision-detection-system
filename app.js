import { Vector } from "./Vector.js"

const friction = 0.1
const elasticity = 1
const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)

const objects = []
export class Object {
    constructor(_x, _y, _mass, _radius, _user = false) {
        this.pos = new Vector(_x, _y)
        this.m = _mass
        this.r = _radius
        this.acceleration = 0.8
        this.a = new Vector(0, 0)
        this.v = new Vector(0, 0)
        this.user = _user
        objects.push(this)
    }
    move() {
        this.v.x += this.a.x
        this.v.y += this.a.y
        this.v.x *= 1 - friction
        this.v.y *= 1 - friction
        this.pos = this.pos.add(this.v)
        this.pos = this.pos.add(this.v)
    }
    show() {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        ctx.fillStyle = "darkslategray"
        ctx.fill() 
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#070113"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function isColliding(a, b) {
    const radiusSum = a.r + b.r
    const distance = a.pos.subtract(b.pos).mag()
    return distance < radiusSum
}
function handleCollision(a, b) {
    const distance = new Vector(a.pos.subtract(b.pos).x, a.pos.subtract(b.pos).y)
    const excess = a.r + b.r - distance.mag()
    const resolve = distance.unit().multiply(excess / 2)
    a.pos = a.pos.add(resolve)
    b.pos = b.pos.add(resolve.multiply(-1))
}
function handleEdges(a) {
    if (a.pos.y + a.r > canvas.height) {
        a.pos.y = canvas.height - a.r
        a.v.y *= -1
    }
    if (a.pos.y - a.r < 0) {
        a.pos.y = a.r
        a.v.y *= -1
    }
    if (a.pos.x + a.r > canvas.width) {
        a.pos.x = canvas.width - a.r
        a.v.x *= -1
    }
    if (a.pos.x - a.r < 0) {
        a.pos.x = a.r
        a.v.x *= -1
    }
}

function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y
}

function collisionResult(a, b) {
    const normal = a.pos.subtract(b.pos).unit()
    const relativeVelocity = a.v.subtract(b.v)
    const seperatingVelocity = dotProduct(relativeVelocity, normal)
    const newSeperatingVelocity = -seperatingVelocity * elasticity
    const seperatingVelocityVector = normal.multiply(newSeperatingVelocity)

    a.v = a.v.add(seperatingVelocityVector)
    b.v = b.v.add(seperatingVelocityVector.multiply(-1))
}


let UP, DOWN, LEFT, RIGHT
window.addEventListener("keydown", (e) => {
    if (e.code == "KeyW") UP = true
    if (e.code == "KeyS") DOWN = true
    if (e.code == "KeyA") LEFT = true
    if (e.code == "KeyD") RIGHT = true
})
window.addEventListener("keyup", (e) => {
    if (e.code == "KeyW") UP = false
    if (e.code == "KeyS") DOWN = false
    if (e.code == "KeyA") LEFT = false
    if (e.code == "KeyD") RIGHT = false
})

for (let i = 0; i < 100; i++) {
    new Object(Math.random() * canvas.width, Math.random() * canvas.height, 10, 30)
}
function move(object) {
    if (object.user) {
        if (UP) object.a.y = -object.acceleration
        if (DOWN) object.a.y = object.acceleration
        if (LEFT) object.a.x = -object.acceleration
        if (RIGHT) object.a.x = object.acceleration
        if (!UP && !DOWN) object.a.y = 0
        if (!LEFT && !RIGHT) object.a.x = 0
    }
}

const firstObject = new Object(300, 300, 10, 30, true)
function animate() {
    clearCanvas()
    for (let i = 0; i < objects.length; i++) {
        const objectA = objects[i]
        for (let j = 0; j < objects.length; j++) {
            const objectB = objects[j]
            if (i === j) continue
            if (isColliding(objectA, objectB)) {
                handleCollision(objectA, objectB)
                collisionResult(objectA, objectB)
            }
        }
        if(objectA.user) {
            move(objectA)
        }
        handleEdges(objectA)
        objectA.move()
        objectA.show()
    }
    requestAnimationFrame(animate)
}
animate()