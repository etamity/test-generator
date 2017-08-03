'use strict';
const gulp = require('gulp');
const tasks = require('promo-builder');
const envs = require('promo-builder/environments');

const settings = {
    sass: './src/sass/**/*.scss',
    entryFile: './src/jsx/Promo.jsx',
    extensions: ['.jsx'],
    autoprefixerLevel: ['last 3 versions', 'Android >= 4.3', 'iOS >= 7'], 
    staticFiles: {
        images: './src/images/**/*',
        videos: './src/video/**/*',
        javascript: './src/js/**/*',
        html: './src/*.html',
        json: './src/*.json'
    }
};

gulp.task('default', ['lint'], function (){
    tasks.buildPromo(settings, envs.DEV);
});

gulp.task('prod', ['lint'], function () {
    tasks.buildPromo(settings, envs.PROD);
});

gulp.task('watch', ['lint'], function () {
    tasks.watch(settings, envs.DEV);
});

gulp.task('lint', function () {
    tasks.lint();
});