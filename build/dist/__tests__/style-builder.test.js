import { StylesBuilder } from '../src/style-builder';
import { StyleResultHandler } from '../src/style-builder/computers/handler';
import { ToObjsStylesTransformer } from '../src/style-builder/transformers/to-objs';
import { StylesComputer } from '../src/style-builder/computers/computer';
const styles = {};
describe('Stylestyler', () => {
    describe('create w styles only', () => {
        let styler;
        beforeEach(() => {
            styler = new StylesBuilder(styles);
        });
        it('should create a Stylestyler object', () => {
            expect(styler).toBeDefined();
        });
        it('has the styles object assigned', () => {
            expect(styler.styles).toBe(styles);
        });
    });
    describe('create w styles and options', () => {
        let styler;
        const name = 'my-styler';
        const propsOnly = true;
        const handler = new StyleResultHandler();
        const transformer = new ToObjsStylesTransformer();
        const computerClass = StylesComputer;
        beforeEach(() => {
            styler = new StylesBuilder(styles, {
                name,
                propsOnly,
                computerClass,
                handler,
                transformer
            });
        });
        it('has the styles object assigned', () => {
            expect(styler.name).toBe(name);
        });
        it('sets styles', () => {
            expect(styler.styles).toBeDefined();
        });
        it('sets computer', () => {
            expect(styler.computer).toBeInstanceOf(StylesComputer);
        });
        it('sets styler on computer', () => {
            expect(styler.computer.styler).toBe(styler);
        });
        it('sets handler on computer', () => {
            expect(styler.computer.handler).toBe(handler);
        });
    });
    describe('compute', () => {
        let styler;
        const props = {
            x: 2
        };
        const state = {
            a: 1
        };
        beforeEach(() => {
            styler = new Stylestyler(styles, {
                name
            });
        });
    });
});
//# sourceMappingURL=style-builder.test.js.map