import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it } from 'vitest';
import CodeEditor from '../src/components/codeEditor/CodeEditor';
import { setupStore, type AppStore } from './setup';



describe('CodeEditor Component', () => {
  let store : AppStore
  beforeEach(() => {
    store = setupStore({
      code: { code: 'hello world', output: '', error: '' }
    });

  });
  
  it('renders CodeMirror and executes code on button click', async () => {
    render(
      <Provider store={store}>
      <CodeEditor />
    </Provider>
    );

    const button = screen.getByRole('button', { name: 'Ejecutar código en el editor' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(store.getState().code.code).toBe('hello world');
    });
  });
});
