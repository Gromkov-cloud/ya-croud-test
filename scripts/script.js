class Slider {
    currentPage = 0;
    isAutoplayStopped = false;
    pagesCount;
    slidesCount;
    paginationDots = [];

    constructor({
        id,
        gap = 20,
        slidesToShow = 3,
        autoplay = false,
        interval = 2000,
        currentPageTextBoxClass = false,
        paginationClass = false,
        brakePoints = [],
        // brakepoints structure [{brakePoint: some px, slidesToShow: num}]
    }) {
        this.id = id;
        this.gap = gap;
        this.slidesToShow = slidesToShow;
        this.autoplay = autoplay;
        this.interval = interval;
        this.currentPageTextBoxClass = currentPageTextBoxClass;
        this.paginationClass = paginationClass;
        this.brakePoints = brakePoints;

        this.initSlider();
    }

    initSlider() {
        this.slider = document.getElementById(this.id);

        this.buttonPrev = this.slider.querySelector(".slider-button-prev");
        this.buttonNext = this.slider.querySelector(".slider-button-next");
        this.sliderWheel = this.slider.querySelector(".slider-wheel");
        this.sliderWheel.style.gap = `${this.gap}px`;
        this.slides = this.slider.querySelectorAll(".slider-slide");
        this.slidesCount = this.slides.length;
        this.pagesCount = this.slidesCount / this.slidesToShow;

        this.slideWidth = this.slides[0].clientWidth + this.gap;

        this.buttonPrev.addEventListener("click", () => {
            this.slidePrev();
        });
        this.buttonNext.addEventListener("click", () => {
            this.slideNext();
        });
        this.slider.addEventListener("mouseenter", () => {
            this.isAutoplayStopped = true;
        });
        this.slider.addEventListener("mouseleave", () => {
            this.isAutoplayStopped = false;
        });

        this.slideEventName = `${this.id}_slide`;
        this.slideEvent = new Event(this.slideEventName);

        if (this.brakePoints.length) {
            console.log(document.documentElement.clientWidth);
            if (
                this.brakePoints[0].brakePoint >=
                document.documentElement.clientWidth
            ) {
                this.slidesToShow = this.brakePoints[0].slidesToShow;
                this.pagesCount = this.slidesCount / this.slidesToShow;
                this.slideWidth = this.slides[0].clientWidth + this.gap;
            }
        }
        if (this.currentPageTextBoxClass) {
            this.currentPageTextBox = this.slider.querySelector(
                `.${this.currentPageTextBoxClass}`
            );
            console.log(this.currentPageTextBox);
            document.addEventListener(this.slideEventName, () => {
                this.printCurrentPage();
            });
        }
        if (this.paginationClass) {
            this.paginationContainer = this.slider.querySelector(
                `.${this.paginationClass}`
            );
            this.slides.forEach((el, index) => {
                const paginationDot = document.createElement("span");
                console.log(paginationDot);
                paginationDot.classList.add("pagination_dot");
                if (index == 0) {
                    paginationDot.classList.add("pagination_dot__active");
                }
                this.paginationDots.push(paginationDot);
                this.paginationContainer.appendChild(paginationDot);
            });
            document.addEventListener(this.slideEventName, () => {
                this.changeActivePaginationDot();
            });
        }
        if (this.autoplay) {
            this.startAutoplay();
        }
    }

    changeActivePaginationDot() {
        this.paginationDots.forEach((dot) => {
            dot.classList.remove("pagination_dot__active");
        });
        this.paginationDots[this.currentPage].classList.add(
            "pagination_dot__active"
        );
    }
    printCurrentPage() {
        this.currentPageTextBox.textContent = this.currentPage + 1;
    }
    slidePrev() {
        this.buttonNext.disabled = false;
        if (this.currentPage <= 0) {
            return;
        }
        this.currentPage = this.currentPage - 1;
        document.dispatchEvent(this.slideEvent);
        if (this.currentPage == 0) {
            this.buttonPrev.disabled = true;
        } else {
            this.buttonPrev.disabled = false;
        }
        let transform = this.currentPage * this.slidesToShow * this.slideWidth;
        this.sliderWheel.style.transform = `translate(-${transform}px,0)`;
    }
    slideNext() {
        this.buttonPrev.disabled = false;
        if (this.currentPage >= this.pagesCount - 1) {
            if (this.autoplay) {
                this.slideToStart();
            }
            return;
        }
        this.currentPage = this.currentPage + 1;
        document.dispatchEvent(this.slideEvent);
        if (this.currentPage == this.pagesCount - 1) {
            this.buttonNext.disabled = true;
        } else {
            this.buttonNext.disabled = false;
        }
        let transform = this.currentPage * this.slidesToShow * this.slideWidth;
        this.sliderWheel.style.transform = `translate(-${transform}px,0)`;
    }
    slideToStart() {
        this.buttonPrev.disabled = true;
        this.buttonNext.disabled = false;
        this.currentPage = 0;
        document.dispatchEvent(this.slideEvent);
        this.sliderWheel.style.transform = `translate(0,0)`;
    }
    startAutoplay() {
        const autoplayInterval = setInterval(() => {
            if (!this.isAutoplayStopped) {
                this.slideNext();
            }
        }, this.interval);
    }
}

const playersSlider = new Slider({
    id: "players-slider",
    autoplay: true,
    interval: 4000,
    currentPageTextBoxClass: "slider_page_counter__current_page",
    brakePoints: [{ brakePoint: 700, slidesToShow: 1 }],
});

const aboutSlider = new Slider({
    id: "about-slider",
    slidesToShow: 1,
    paginationClass: "about_slider__pagination",
});

const anchors = document.querySelectorAll('button[href*="#"]');

for (let anchor of anchors) {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const blockID = anchor.getAttribute("href").slice(1);

        document.getElementById(blockID).scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
}

let bg = document.querySelectorAll(".mouse-parallax-bg");
for (let i = 0; i < bg.length; i++) {
    window.addEventListener("mousemove", function (e) {
        let x = e.clientX / window.innerWidth;
        let y = e.clientY / window.innerHeight;
        bg[i].style.transform =
            "translate(-" + x * 50 + "px, -" + y * 50 + "px)";
    });
}
