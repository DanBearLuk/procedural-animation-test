interface PositionBuffer {
    position: WebGLBuffer
}

function initBuffers(gl: WebGL2RenderingContext): PositionBuffer {
    const positionBuffer = initPositionBuffer(gl);

    return {
        position: positionBuffer,
    };
}

function initPositionBuffer(gl: WebGL2RenderingContext): WebGLBuffer {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

export { initBuffers, PositionBuffer };
