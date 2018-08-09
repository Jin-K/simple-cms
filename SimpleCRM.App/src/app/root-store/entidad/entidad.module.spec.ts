import { EntidadModule } from './entidad.module';

describe('EntidadModule', () => {
  let entidadModule: EntidadModule;

  beforeEach(() => {
    entidadModule = new EntidadModule();
  });

  it('should create an instance', () => {
    expect(entidadModule).toBeTruthy();
  });
});
