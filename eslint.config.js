import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'
import globals from 'globals'

import { FlatCompat } from '@eslint/eslintrc'
import pluginJs from '@eslint/js'
import path from 'path'
import { fileURLToPath } from 'url'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended })

const settings = {
  react: {
    version: "detect" // or specify your React version
  }
};

export default [
  { languageOptions: { globals: globals.browser },settings},
  ...compat.extends('eslint-config-love'),
  pluginReactConfig
]
