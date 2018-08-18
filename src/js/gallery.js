class Gallery {
    constructor(options = {}) {
        this.options = {
            carouselContent: $(".carousel__content")
        };
        Object.assign(this.options, options);

        this.carouselContent = this.options.carouselContent;
        this.carouselIndex = 0
        this.carouselLength = this.carouselContent.children().length;
        this.isAnimating = false;
        this.itemWidth = 100 / this.carouselLength;
        this.firstItem = $(this.carouselContent.children()[0]);
        this.lastItem = $(this.carouselContent.children()[this.carouselLength - 1]);
        this.firstClone = null;
        this.lastClone = null;
    }

    init() {
        // Apply the 3D transformations to avoid a white blink when you slide for the first time
        this.carouselContent.css("width", this.carouselLength * 100 + "%");

        this.carouselContent.transition({
            x: `${this.carouselIndex * -this.itemWidth}%`
        }, 0);

        $.each(this.carouselContent.children(), (key, item) => {
            return $(item).css("width", this.itemWidth + "%");
        });

        $(".nav--left").on("click", () => this.moveLeft());
        $(".nav--right").on("click", () => this.moveRight());
    }

    moveLeft() {
        if (this.isAnimating) {
            return;
        }
        this.isAnimating = true;
        this.carouselIndex--;
        if (this.carouselIndex === -1) {
            this.lastItem.prependTo(this.carouselContent);
            this.carouselContent.transition({
                x: `${(this.carouselIndex + 2) * -this.itemWidth}%`
            }, 0);
            return this.carouselContent.transition({
                x: `${(this.carouselIndex + 1) * -this.itemWidth}%`
            }, 1000, "easeInOutExpo", () => {
                this.carouselIndex = this.carouselLength - 1;
                this.lastItem.appendTo(this.carouselContent);
                this.carouselContent.transition({
                    x: `${this.carouselIndex * -this.itemWidth}%`
                }, 0);
                return this.isAnimating = false;
            });
        } else {
            return this.carouselContent.transition({
                x: `${this.carouselIndex * -this.itemWidth}%`
            }, 1000, "easeInOutExpo", () => {
                return this.isAnimating = false;
            });
        }
    }

    moveRight() {
        if (this.isAnimating) {
            return;
        }
        this.isAnimating = true;
        this.carouselIndex++;
        return this.carouselContent.transition({
            x: `${this.carouselIndex * -this.itemWidth}%`
        }, 1000, "easeInOutExpo", ()=> {
            this.isAnimating = false;
            if (this.firstClone) {
                this.carouselIndex = 0;
                this.carouselContent.transition({
                    x: `${this.carouselIndex * -this.itemWidth}%`
                }, 0);
                this.firstClone.remove();
                this.firstClone = null;
                this.carouselLength = this.carouselContent.children().length;
                this.itemWidth = 100 / this.carouselLength;
                this.carouselContent.css("width", this.carouselLength * 100 + "%");
                $.each(this.carouselContent.children(), (key, item) => {
                    return $(item).css("width", this.itemWidth + "%");
                });
                return;
            }
            if (this.carouselIndex === this.carouselLength - 1) {
                this.carouselLength++;
                this.itemWidth = 100 / this.carouselLength;
                this.firstClone = this.firstItem.clone();
                this.firstClone.addClass("clone");
                this.firstClone.appendTo(this.carouselContent);
                this.carouselContent.css("width", this.carouselLength * 100 + "%");
                $.each(this.carouselContent.children(), (key, item) => {
                    return $(item).css("width", this.itemWidth + "%");
                });
                return this.carouselContent.transition({
                    x: `${this.carouselIndex * -this.itemWidth}%`
                }, 0);
            }
        });

    }
}