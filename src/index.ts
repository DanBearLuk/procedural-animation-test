import { drawScene } from './draw-scene';
import { initBuffers } from './init-buffers';
import vsPath from './shaders/shader.vert';
import fsPath from './shaders/shader.frag';

async function readFile(path: string) {
    const stream = await fetch(path);
    const content = await stream.text();

    return content;
}

function loadShader(gl: WebGL2RenderingContext, type: GLenum, sSource: string) {
    const shader = gl.createShader(type)!!;

    gl.shaderSource(shader, sSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(type + ' shader compilation failed.');
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
    const vs = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vs || !fs) {
        return null;
    }

    const program = gl.createProgram()!!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert(`Unable to link program: ${gl.getProgramInfoLog(program)}`);
        return null;
    }

    window.addEventListener('beforeunload', () => gl.deleteProgram(program));

    return program;
}

async function init() {
    const canvas = document.getElementById('glcanvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2');

    if (gl === null) {
        alert('Unable to initialize webgl2 context.');
        return;
    }

    const shaderProgram = initShaderProgram(gl, 
        await readFile(vsPath),
        await readFile(fsPath)
    );

    if (!shaderProgram) {
        alert('Unable to initialize shader program.');
        return;
    }

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    const buffers = initBuffers(gl);

    drawScene(gl, programInfo, buffers);
}

window.addEventListener('load', init);
