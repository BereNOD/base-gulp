var gulp         = require('gulp'); 									// Подключаем к проекту Gulp
var sass         = require('gulp-sass'); 							// Подключаем к проекту Sass
var autoprefixer = require('gulp-autoprefixer'); 			// Подключаем к проекту Autoprefixer
var cleanCSS     = require('gulp-clean-css'); 				// Подключаем к проекту Clean-css
var rename       = require('gulp-rename'); 						// Подключаем к проекту Rename
var browserSync  = require('browser-sync').create();	// Подключаем к проекту Browser-sync
var concat       = require('gulp-concat'); 						// Подключаем к проекту Concat
var uglify       = require('gulp-uglify'); 						// Подключаем к проекту Uglify

gulp.task('browser-sync', ['styles', 'scripts'], function() { // описываем задание (task) для Gulp: browser-sync, перед выполнением этого task`а выполнить: styles, scripts
		browserSync.init({ // Инициализация Browser-sync
				server: { // параметры конфигурации
						baseDir: "./app" // Путь к базовой директории локального сервера: ./app
				} // завершаем параметры конфигурации
		}); // завершаем инициализацию Browser-sync
}); // завершаем task browser-sync

gulp.task('styles', function () { // описываем задание (task) для Gulp: styles
	return // возвращаем из task`а все что идёт до ';'
		gulp.src('sass/**/*.+(sass|scss|css)') // получаем данные по пути указанном в маске (Регулярном выражении): из корня проекта, из папки sass, во всех поддиректориях (**), с любым названием (*), и разширением файла sass, scss или css (sass|scss|css)
			.pipe( // передаём в поток (в "трубу")
				sass({ // передаём управление пакету Sass, передаём параметры конфигурации
					includePaths: require('node-bourbon').includePaths // включить в использование пакет bourbon: https://www.npmjs.com/package/node-bourbon
				} // завершаем параметры конфигурации
			).on('error', sass.logError)) // в случае возникновения ошибки вывести её в консоль
			.pipe(
				rename({ // передаём управление пакету Rename, передаём параметры конфигурации
					suffix: '.min', // суфикс (перед расширением файла) .min
					prefix : '' // префикс (перед названием файла) пустая строка
				})
			)
			.pipe(
				autoprefixer({ // передаём управление пакету Autoprefixer, передаём параметры конфигурации
					browsers: ['last 15 versions'], // вендорные префискы для поддержки последних 15 версий популярных браузеров
					cascade: false // каскадное визуальное отображение в файла на выходе, если нет сжатия: отключено
				})
			)
			.pipe(
				cleanCSS() // передаём управление пакету Clean-css, без параметров конфигурации. Нужен для сжатия css.
			)
			.pipe(
				gulp.dest('app/css') // выгружаем готовые файлы, нужную директорию указываем в качестве параметра
			)
			.pipe(
				browserSync.stream() // передаём управление пакету Browser-sync, без параметров конфигурации. Нужен для синхронизации с браузером
			);
});

gulp.task('scripts', function() { // описываем задание (task) для Gulp: scripts
	return // возвращаем из task`а все что идёт до ';'
		gulp.src([ // достаём библиотеки по путям из массива
			'./app/libs/modernizr/modernizr.js', // Modernizr
			'./app/libs/jquery/jquery-1.11.2.min.js', // jQuery
			'./app/libs/waypoints/waypoints.min.js', // Waypoints
			'./app/libs/animate/animate-css.js', // Animate-css
		])
		.pipe(
			concat('libs.js') // передаём управление пакету Concat, в качестве параметра передаём название результирующего файла
		)
		.pipe(
			uglify() // передаём управление пакету Uglify, без параметров
		)
		.pipe(
			gulp.dest('./app/js/') // выгружаем готовые файлы, нужную директорию указываем в качестве параметра
		);
});

gulp.task('watch', function () { // описываем задание (task) наблюдатель (watcher) для Gulp: watch
	gulp.watch('sass/**/*.+(sass|scss|css)', ['styles']);					// методу watch первым параметром передаём путь или маску к файлу/файлам, за которыми нужно следить
	gulp.watch('app/libs/**/*.js', ['scripts']);									// вторым параметром передаём массив строк с названиями заданий,
																																// которые нужно выполнить, если файлы из первого параметра изменятся.
	gulp.watch('app/js/*.js').on("change", browserSync.reload);		// методом on() навешиваем обработчик событий, первый параметр - название события,
	gulp.watch('app/*.html').on('change', browserSync.reload);		// второй - метод, который выполняется в случае, если событие произошло
});

gulp.task('default', ['browser-sync', 'watch']);  // описываем задание (task) по умолчанию (default) для Gulp: default
																									// задание вызывает 2 других: browser-sync, watch - описанных в массиве, вторым параметром.
