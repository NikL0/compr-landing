const wpcf7Elm = document.querySelectorAll('.wpcf7');
const modalCalc = document.getElementById('modalCalc');
const modal = document.getElementById('modal');
const modalCallback = document.getElementById('modalCallback');
const modalPdf = document.getElementById('modalPdf');
const modalVisit = document.getElementById('modalVisit');
const openCalc = document.querySelectorAll('.open-calc');
const openModal = document.querySelectorAll('.open-modal');
const openCallback = document.querySelectorAll('.open-callback');
const openPdf = document.querySelectorAll('.open-pdf');
const openVisit = document.querySelectorAll('.open-visit');
const blogFilter = document.querySelector('.blog-wrap__top');
const blogWrapper = document.querySelector('.blog-wrap__list');
const order = document.getElementById('order');
const modalCalculator = document.getElementById('modalCalculator');
const openCalculator = document.querySelectorAll('.open-calculator');
let currentPage = 1;
let postCount = 0;

if (order) {
    order.addEventListener('change', () => {
        document.querySelector('.blog-wrap__top--left .btn').click();
    })
}

if (blogFilter) {
    blogFilter.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.querySelector('.btn');
        renderBlog(btn);
    })
}

if (openCalc[0]) {
    openCalc.forEach(item => {
        item.addEventListener('click', () => {
            modalCalc.classList.add('modal-active');
        })
    })
}

if (openCalculator[0]) {
    openCalculator.forEach(item => {
        item.addEventListener('click', () => {
            modalCalculator.classList.add('modal-active');
        })
    })
}

if (openModal[0]) {
    openModal.forEach(item => {
        item.addEventListener('click', () => {
            modal.classList.add('modal-active');
        })
    })
}

if (openCallback[0]) {
    openCallback.forEach(item => {
        item.addEventListener('click', () => {
            modalCallback.classList.add('modal-active');
        })
    })
}

if (openPdf[0]) {
    openPdf.forEach(item => {
        item.addEventListener('click', () => {
            modalPdf.classList.add('modal-active');
        })
    })
}

if (openVisit[0]) {
    openVisit.forEach(item => {
        item.addEventListener('click', () => {
            modalVisit.classList.add('modal-active');
        })
    })
}


if (wpcf7Elm[0]) {
    wpcf7Elm.forEach(item => {
        const rows = item.querySelectorAll('.row');
        item.addEventListener('wpcf7submit', function (event) {
            if (rows[0]) {
                rows.forEach(r => {
                    r.classList.remove('row-err');
                    setTimeout(() => {
                        const isError = r.querySelector('.wpcf7-not-valid');
                        if (isError) {
                            r.classList.add('row-err');
                        }
                    }, 1);
                });
            }
        }, false);
    })
}

function renderBlog(node) {
    node.classList.add('loading');
    const data = {
        action: 'renderBlog',
        category: document.getElementById('category').value,
        publish: document.getElementById('publish').value,
        read_time: document.getElementById('read_time').value,
        order: document.getElementById('order').value,
        paged: currentPage,
        count: postCount
    }
    jQuery.post('/wp-admin/admin-ajax.php', data, function (response) {
        blogWrapper.innerHTML = response.slice(0, -1);
        addBlogEvents();
        node.classList.remove('loading');
    });
}

function addBlogEvents() {
    const blogNavItems = document.querySelectorAll('.blog-wrap__list--nav span');
    const btnMore = document.querySelector('.blog-wrap__list--more .btn');
    if (blogNavItems[0]) {
        blogNavItems.forEach(item => {
            item.addEventListener('click', () => {
                if (!item.classList.contains('prev') && !item.classList.contains('next')) {
                    blogNavItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    currentPage = item.textContent;
                    renderBlog(item);
                    document.querySelector('.blog-wrap__top').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    })
                }
                else if (item.classList.contains('prev')) {
                    if (currentPage !== 1) {
                        blogNavItems[1].click();
                    }
                }
                else if (item.classList.contains('next')) {
                    if (currentPage !== blogNavItems.length - 2) {
                        blogNavItems[blogNavItems.length - 2].click();
                    }
                }
            })
        })
    }
    if (btnMore) {
        btnMore.addEventListener('click', () => {
            const count = Number(btnMore.getAttribute('data-count'));
            postCount += count;
            btnMore.setAttribute('data-count', postCount);
            renderBlog(btnMore);
        })
    }
}

addBlogEvents();

new WOW().init();

const lang = document.documentElement.lang || 'en';
const locale = lang === 'pl-PL' ? {
    firstDayOfWeek: 1,
    weekdays: { shorthand: ['Nd', 'Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'So'], longhand: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'] },
    months: { shorthand: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'], longhand: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'] },
    rangeSeparator: ' do ',
    weekAbbreviation: 'Tydz.',
    scrollTitle: 'Przewiń, aby dostosować',
    toggleTitle: 'Kliknij, aby przełączyć',
    amPM: ['AM', 'PM'],
    yearAriaLabel: 'Rok',
    monthAriaLabel: 'Miesiąc',
    hourAriaLabel: 'Godzina',
    minuteAriaLabel: 'Minuta'
} : {};

const today = new Date();
const currentHours = today.getHours();
const currentMinutes = today.getMinutes();
const minTimeToday = `${String(currentHours).padStart(2, '0')}:${String(Math.ceil(currentMinutes / 5) * 5).padStart(2, '0')}`;

const timePicker = flatpickr('.custom-time-pick', {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: true,
    minuteIncrement: 5,
    minTime: typeof minTimeToday !== 'undefined' ? minTimeToday : '00:00',
    locale: locale
});

const datePicker = flatpickr('.custom-date-pick', {
    minDate: 'today',
    dateFormat: 'Y-m-d',
    disableMobile: true,
    maxDate: new Date().fp_incr(365),
    locale: locale,
    onChange: (selectedDates, dateStr) => {
        if (selectedDates.length > 0) {
            const isToday = selectedDates[0].toDateString() === new Date().toDateString();
            
            timePicker.set('minTime', isToday ? minTimeToday : '00:00');
            
            if (isToday) {
                timePicker.clear();
            }
        }
    }
});