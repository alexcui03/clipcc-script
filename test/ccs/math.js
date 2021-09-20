import Stage from 'clipcc-script/stage';

class TestStage extends Stage {
    constructor() {
        this.a = 0;
    }

    whenGreenFlag() {
        this.a = 1; // This is an comment
        /*
         * This is block comment
         */
        this.a = this.a + 1;
    }
}
