import { ChatModule } from './chat.module';

describe('ChatModule', () => {
  let chatModule: ChatModule;

  beforeEach(() => {
    chatModule = new ChatModule();
  });

  it('should create an instance', () => {
    expect(chatModule).toBeTruthy();
  });
});
