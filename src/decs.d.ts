declare module "lucky-case" {
  export class InvalidCaseError extends Error { }
  export class InvalidConstantError extends Error { }
  export class LuckyCase {
    /**
     * Get type of case of string (one key of LuckyCase.CASES)
     *
     * If more than one case matches, the first match wins.
     * Match prio is the order of the regex in LuckyCase.CASES
     *
     * If you want or need to know all cases, use plural version of this method
     *
     * If you want to check explicitly for one case, use its check method,
     * e.g. isSnakeCase() for SNAKE_CASE, etc...
     *
     * @param {string} string
     * @param {boolean} allow_prefixed_underscores
     * @returns {string|null} symbol of type, null if no match
     */
    static case(string: string, allow_prefixed_underscores?: boolean): any;

    /**
     * Get types of cases of string (keys of LuckyCase.CASES)
     *
     * @param {string} string
     * @param {boolean} allow_prefixed_underscores
     * @returns {string[]|null} symbols of types, null if no one matches
     */
    static cases(string: string, allow_prefixed_underscores?: boolean): RegExp[]

    /**
     * Convert a string into the given case type
     *
     * @param {string} string to convert
     * @param {string} case_type can be UPPER_CASE or lower_case, e.g. 'SNAKE_CASE' or 'snake_case'
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static convertCase(string, case_type, preserve_prefixed_underscores?: boolean): string | InvalidCaseError;

    /**
     * Check if given case type is a valid case type
     *
     * @param {string} case_type to check
     * @returns {boolean}
     */
    static isValidCaseType(case_type: RegExp): boolean;

    /**
     * Check if the string matches any of the available cases
     *
     * @param {string} string to check
     * @returns {boolean}
     */
    static isValidCaseString(string: string): boolean;

    //----------------------------------------------------------------------------------------------------
    // UPPER CASE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert all characters inside the string
     * into upper case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'THIS-ISANEXAMPLE_STRING'
     *
     * @param {string} string to convert
     * @returns {string}
     */
    static toUpperCase(string: string): string;

    /**
     * Check if all characters inside the string are upper case
     *
     * @param {string} string to check
     * @returns {boolean}
     */
    static isUpperCase(string: string): boolean;

    //----------------------------------------------------------------------------------------------------
    // LOWER CASE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert all characters inside the string
     * into lower case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'this-isanexample_string'
     *
     * @param {string} string to convert
     * @returns {string}
     */
    static toLowerCase(string: string): string;
 
    /**
     * Check if all characters inside the string are lower case
     *
     * @param {string} string to check
     * @returns {boolean}
     */
    static isLowerCase(string: string): boolean;

    //----------------------------------------------------------------------------------------------------
    // SNAKE CASE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert the given string from any case
     * into snake case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'this_is_an_example_string'
     *
     * @param {string} string to convert
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static toSnakeCase(string: string, preserve_prefixed_underscores?: boolean): string;

    /**
     * Check if the string is snake case
     *
     * @param {string} string to check
     * @param {boolean} allow_prefixed_underscores
     * @returns {boolean}
     */
    static isSnakeCase(string: string, allow_prefixed_underscores?: boolean): boolean;

    /**
     * Convert the given string from any case
     * into upper snake case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'THIS_IS_AN_EXAMPLE_STRING'
     *
     * @param {string} string to convert
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static toUpperSnakeCase(string: string, preserve_prefixed_underscores?: boolean): boolean;

    /**
     * Check if the string is upper snake case
     *
     * @param {string} string to check
     * @param {boolean} allow_prefixed_underscores
     * @returns {boolean}
     */
    static isUpperSnakeCase(string: string, allow_prefixed_underscores?: boolean): boolean;

    //----------------------------------------------------------------------------------------------------
    // PASCAL CASE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert the given string from any case
     * into pascal case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'ThisIsAnExampleString'
     *
     * @param string to convert
     * @param preserve_prefixed_underscores
     * @returns {string}
     */
    static toPascalCase(string: string, preserve_prefixed_underscores?: boolean): string;

    /**
     * Check if the string is upper pascal case
     *
     * @param {string} string to check
     * @param {boolean} allow_prefixed_underscores
     * @returns {boolean}
     */
    static isPascalCase(string: string, allow_prefixed_underscores?: boolean): boolean;

    //----------------------------------------------------------------------------------------------------
    // CAMEL CASE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert the given string from any case
     * into camel case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'thisIsAnExampleString'
     *
     * @param {string} string to convert
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static toCamelCase(string: string, preserve_prefixed_underscores?: boolean): string;

    /**
     * Check if the string is camel case
     *
     * @param {string} string to check
     * @param {boolean} allow_prefixed_underscores
     * @returns {boolean}
     */
    static isCamelCase(string: string, allow_prefixed_underscores?: boolean): boolean;

    //----------------------------------------------------------------------------------------------------
    // DASH CASE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert the given string from any case
     * into dash case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'this-is-an-example-string'
     *
     * @param {string} string to convert
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static toDashCase(string: string, preserve_prefixed_underscores?: boolean): string;

    /**
     * Check if the string is dash case
     *
     * @param {string} string to check
     * @param {boolean} allow_prefixed_underscores
     * @returns {boolean}
     */
    static isDashCase(string: string, allow_prefixed_underscores?: boolean): boolean;

    /**
     * Convert the given string from any case
     * into upper dash case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'THIS-IS-AN-EXAMPLE-STRING'
     *
     * @param {string} string to convert
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static toUpperDashCase(string: string, preserve_prefixed_underscores?: boolean): string;

    /**
     * Check if the string is upper dash case
     *
     * @param {string} string to check
     * @param {boolean} allow_prefixed_underscores
     * @returns {boolean}
     */
    static isUpperDashCase(string: string, allow_prefixed_underscores?: boolean): boolean;

    //----------------------------------------------------------------------------------------------------
    // TRAIN CASE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert the given string from any case
     * into train case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'This-Is-An-Example-String'
     *
     * @param {string} string to convert
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static toTrainCase(string: string, preserve_prefixed_underscores?: boolean): string;

    /**
     * Check if the string is train case
     *
     * @param {string} string to check
     * @param {boolean} allow_prefixed_underscores
     * @returns {boolean}
     */
    static isTrainCase(string: string, allow_prefixed_underscores?: boolean): boolean;

    //----------------------------------------------------------------------------------------------------
    // WORD CASE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert the given string from any case
     * into word case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'this is an example string'
     *
     * @param {string} string to convert
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static toWordCase(string: string, preserve_prefixed_underscores?: boolean): string;

    /**
     * Check if the string is word case
     *
     * @param {string} string to check
     * @param allow_prefixed_underscores
     * @returns {boolean}
     */
    static isWordCase(string: string, allow_prefixed_underscores?: boolean): boolean;

    /**
     * Convert the given string from any case
     * into upper word case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'THIS IS AN EXAMPLE STRING'
     *
     * @param {string} string to convert
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static toUpperWordCase(string: string, preserve_prefixed_underscores?: boolean): string;

    /**
     * Check if the string is upper word case
     *
     * @param string to check
     * @param allow_prefixed_underscores
     * @returns {boolean}
     */
    static isUpperWordCase(string: string, allow_prefixed_underscores?: boolean): boolean;


    /**
     * Convert the given string from any case
     * into capital word case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'This Is An Example String'
     *
     * @param {string} string to convert
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static toCapitalWordCase(string: string, preserve_prefixed_underscores?: boolean): string;


    /**
     * Check if the string is capital word case
     *
     * @param {string} string to check
     * @param {boolean} allow_prefixed_underscores
     * @returns {boolean}
     */
    static isCapitalWordCase(string: string, allow_prefixed_underscores?: boolean): boolean;

    //----------------------------------------------------------------------------------------------------
    // SENTENCE CASE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert the given string from any case
     * into sentence case
     *
     * @example conversion
     *      'this-isAnExample_string' => 'This is an example string'
     *
     * @param {string} string to convert
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static toSentenceCase(string: string, preserve_prefixed_underscores?: boolean): string;


    /**
     * Check if the string is sentence case
     *
     * @param {string} string to check
     * @param {boolean} allow_prefixed_underscores
     * @returns {boolean}
     */
    static isSentenceCase(string: string, allow_prefixed_underscores?: boolean): boolean;


    //----------------------------------------------------------------------------------------------------
    // CAPITALIZE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert the first character to capital
     *
     * @param {string} string to convert
     * @param {boolean} skip_prefixed_underscores
     * @returns {string}
     */
    static toCapital(string: string, skip_prefixed_underscores?: boolean): string;


    /**
     * Convert the first character to capital
     *
     * @param {string} string to convert
     * @param {boolean} skip_prefixed_underscores
     * @returns {string}
     */
    static capitalize(string: string, skip_prefixed_underscores?: boolean): string;

    /**
     * Check if the strings first character is a capital letter
     *
     * @param {string} string
     * @param {boolean} skip_prefixed_underscores
     * @returns {boolean}
     */
    static isCapital(string: string, skip_prefixed_underscores?: boolean): boolean;


    /**
     * Check if the strings first character is a capital letter
     *
     * @param {string} string
     * @param {boolean} skip_prefixed_underscores
     * @returns {boolean}
     */
    static isCapitalized(string: string, skip_prefixed_underscores?: boolean): boolean;

    /**
     * Convert the first character to lower case
     *
     * @param {string} string to convert
     * @param {boolean} skip_prefixed_underscores
     * @returns {string}
     */
    static decapitalize(string: string, skip_prefixed_underscores?: boolean): string;

    /**
     * Check if the strings first character is a lower case letter
     *
     * @param {string} string
     * @param {boolean} skip_prefixed_underscores
     * @returns {boolean}
     */
    static isNotCapital(string: string, skip_prefixed_underscores?: boolean): boolean;

    /**
     * Check if the strings first character is a lower case letter
     *
     * @param {string} string
     * @param {boolean} skip_prefixed_underscores
     * @returns {boolean}
     */
    static isDecapitalized(string: string, skip_prefixed_underscores?: boolean): boolean;

    //----------------------------------------------------------------------------------------------------
    // MIXED CASE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert the given string from any case
     * into mixed case.
     *
     * The new string is ensured to be different from the input.
     *
     * @example conversion
     *      'this-isAnExample_string' => 'This-Is_anExample-string'
     *
     * @param {string} string
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static toMixedCase(string: string, preserve_prefixed_underscores?: boolean): string;

    /**
     * Check if the string is a valid mixed case (without special characters!)
     *
     * @param {string} string
     * @param {boolean} allow_prefixed_underscores
     * @returns {boolean}
     */
    static isMixedCase(string: string, allow_prefixed_underscores?: boolean): boolean;

    //----------------------------------------------------------------------------------------------------
    // SWAP CASE
    //----------------------------------------------------------------------------------------------------

    /**
     * Swaps character cases in string
     *
     * lower case to upper case
     * upper case to lower case
     * dash to underscore
     * underscore to dash
     *
     * @example conversion
     *      'this-isAnExample_string' => 'THIS_ISaNeXAMPLE-STRING'
     *
     * @param {string} string
     * @param {boolean} preserve_prefixed_underscores
     * @returns {string}
     */
    static swapCase(string: string, preserve_prefixed_underscores?: boolean): string;

    //----------------------------------------------------------------------------------------------------
    // CONSTANTIZE
    //----------------------------------------------------------------------------------------------------

    /**
     * Convert the string from any case
     * into pascal case and casts it into a constant
     *
     * Does not work in all node js contexts because of scopes, where the constant is not available here.
     * Then you might use eval(LuckyCase.toPascalCase) instead.
     * Or you may use it with global defined variables, global.<variable_name>
     *
     * @example conversion
     *      'this-isAnExample_string' => ThisIsAnExampleString
     *      'this/is_an/example_path' => ThisIsAnExamplePath
     *
     * @param {string} string
     * @returns {any}
     */
    static constantize(string: any): any;

    /**
     * Deconverts the constant back into specified target type
     *
     * Does not work in special scopes in node js
     *
     * @example deconversion
     *      ThisAweSomeConstant => 'thisAweSomeConstant'
     *      function myFunction() {} => 'myFunction'
     *
     * @param {function} constant
     * @param {string} case_type
     * @returns {string}
     */
    static deconstantize(constant: any, case_type?: RegExp): string;

    //----------------------------------------------------------------------------------------------------
    // HELPERS
    //----------------------------------------------------------------------------------------------------

    /**
     * Return string without underscores at the start
     *
     * @param {string} string
     * @returns {string} string without prefixed underscores
     */
    static cutUnderscoresAtStart(string: string): string;

    /**
     * Return the underscores at the start of the string
     *
     * @param {string} string
     * @returns {string} string of underscores or empty if none found
     */
    static getUnderscoresAtStart(string: string): string;

    /**
     * Split the string into parts
     * It is splitted by all (different) case separators
     *
     * @param {string} string
     * @returns {string[]}
     */
    static splitCaseString(string: string): string[];
  }
  export default LuckyCase;
}

declare module "node-redis-pubsub";
