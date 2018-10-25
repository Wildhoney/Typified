export default [
    {
        type: 'String s ⇒ s → s',
        ast: {
            generics: [],
            aliases: { s: 'String' },
            types: [['String'], ['String']]
        }
    },
    {
        type: '∀ a. Array(a) → a',
        ast: {
            generics: ['a'],
            aliases: {},
            types: [['Array(a)'], ['a']]
        }
    },
    {
        type: '∀ a. Number n ⇒ n → a → a',
        ast: {
            generics: ['a'],
            aliases: { n: 'Number' },
            types: [['Number'], ['a'], ['a']]
        }
    },
    {
        type: '∀ a. Number n ⇒ String|void → String|a|Array(String) → Number|void',
        ast: {
            generics: ['a'],
            aliases: { n: 'Number' },
            types: [['String', 'void'], ['String', 'a', 'Array(String)'], ['Number', 'void']]
        }
    }
];
