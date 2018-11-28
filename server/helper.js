"use strict";

module.exports = {
    throw_err: throw_err
};

function throw_err(msg, code) {
    let error = new Error(msg);
    error.status = code;
    throw error;
}
