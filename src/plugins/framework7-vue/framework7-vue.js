// Import Framework7 Bundle
import Framework7 from 'framework7/lite-bundle';
// Import Framework7-Vue with helper to register all components
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

// Init plugin and register all components
Framework7.use(Framework7Vue);

export default function installFramework7(app) {
    // register all Framework7 Vue components by passing Vue app instance there
    console.log(1111111111)
    registerComponents(app);
};
