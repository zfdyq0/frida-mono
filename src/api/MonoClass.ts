import { MonoImage } from './MonoImage'
import { MonoType } from './MonoType'
import { MonoClassField } from './MonoClassField'
import { createNativeFunction } from '../core/native'

export const mono_class_get = createNativeFunction('mono_class_get', 'pointer', ['pointer', 'uint32'])
export const mono_class_get_fields = createNativeFunction('mono_class_get_fields', 'pointer', ['pointer', 'pointer'])
export const mono_class_from_name = createNativeFunction('mono_class_from_name', 'pointer', ['pointer', 'pointer', 'pointer'])
export const mono_class_from_mono_type = createNativeFunction('mono_class_from_mono_type', 'pointer', ['pointer'])
export const mono_class_from_name_case_checked = createNativeFunction('mono_class_from_name_case_checked', 'pointer', ['pointer', 'pointer', 'pointer', 'pointer'])
export const mono_class_from_typeref = createNativeFunction('mono_class_from_typeref', 'pointer', ['pointer', 'uint32'])
export const mono_class_from_typeref_checked = createNativeFunction('mono_class_from_typeref_checked', 'pointer', ['pointer', 'uint32', 'pointer'])
export const mono_class_array_element_size = createNativeFunction('mono_class_array_element_size', 'int32', ['pointer'])
export const mono_class_data_size = createNativeFunction('mono_class_data_size', 'int32', ['pointer'])
export const mono_class_enum_basetype = createNativeFunction('mono_class_enum_basetype', 'pointer', ['pointer'])
export const mono_class_get_byref_type = createNativeFunction('mono_class_get_byref_type', 'pointer', ['pointer'])
export const mono_class_get_element_class = createNativeFunction('mono_class_get_element_class', 'pointer', ['pointer'])
export const mono_class_get_field = createNativeFunction('mono_class_get_field', 'pointer', ['pointer', 'uint32'])
export const mono_class_get_flags = createNativeFunction('mono_class_get_flags', 'int32', ['pointer'])
export const mono_class_get_image = createNativeFunction('mono_class_get_image', 'pointer', ['pointer'])
export const mono_class_get_interfaces = createNativeFunction('mono_class_get_interfaces', 'pointer', ['pointer', 'pointer'])
export const mono_class_get_name = createNativeFunction('mono_class_get_name', 'pointer', ['pointer'])
export const mono_class_get_namespace = createNativeFunction('mono_class_get_namespace', 'pointer', ['pointer'])
export const mono_class_get_nesting_type = createNativeFunction('mono_class_get_nesting_type', 'pointer', ['pointer'])
export const mono_class_get_parent = createNativeFunction('mono_class_get_parent', 'pointer', ['pointer'])
export const mono_class_get_rank = createNativeFunction('mono_class_get_rank', 'int', ['pointer'])
export const mono_class_get_type = createNativeFunction('mono_class_get_type', 'pointer', ['pointer'])
export const mono_class_get_type_token = createNativeFunction('mono_class_get_type_token', 'uint32', ['pointer'])
export const mono_class_implements_interface = createNativeFunction('mono_class_implements_interface', 'bool', ['pointer', 'pointer'])
export const mono_class_init = createNativeFunction('mono_class_init', 'bool', ['pointer'])
export const mono_class_instance_size = createNativeFunction('mono_class_instance_size', 'int32', ['pointer'])

/**
 * Mono doc: http://docs.go-mono.com/?link=xhtml%3adeploy%2fmono-api-class.html
 */
interface MonoClassOptions {
  address?: NativePointer
}

const cache: { [address: number]: MonoClass } = {}
export class MonoClass {
  public $address: NativePointer

  constructor(options: MonoClassOptions = {}) {
    if (options.address) {
      this.$address = options.address
    } else {
      throw new Error('Construction logic not implemented yet. (MonoClass)')
    }
  }

  /**
   * @returns {string} The namespace of the class.
   */
  get namespace(): string {
    return mono_class_get_namespace(this.$address).readUtf8String()
  }

  /**
   * @returns {string} The name of the class.
   */
  get name(): string {
    return mono_class_get_name(this.$address).readUtf8String()
  }

  /**
   * Use to get the size of a class in bytes.
   * @returns {number} The size of an object instance
   */
  get instanceSize(): number {
    return mono_class_instance_size(this.$address)
  }

  /**
   * @returns {number} The number of bytes an element of type klass uses when stored into an array.
   */
  get arrayElementSize(): number {
    return mono_class_array_element_size(this.$address)
  }

  /**
   * @returns {number} The number of bytes an element of type klass uses when stored into an array.
   */
  get dataSize(): number {
    return mono_class_data_size(this.$address)
  }

  /**
   * This method returns the internal Type representation for the class.
   * @returns {MonoType} The MonoType from the class.
   */
  get type(): MonoType {
    const address = mono_class_get_type(this.$address)
    return MonoType.fromAddress(address)
  }

  /**
   * This method returns type token for the class.
   * @returns {number} The type token for the class.
   */
  get typeToken(): number {
    return mono_class_get_type_token(this.$address)
  }

  /**
   * Use this function to get the underlying type for an enumeration value.
   * @returns {MonoType} The underlying type representation for an enumeration.
   */
  get enumBasetype(): MonoType {
    const address = mono_class_enum_basetype(this.$address)
    return MonoType.fromAddress(address)
  }

  /**
   * @returns {MonoType}
   */
  get byrefType(): MonoType {
    const address = mono_class_get_byref_type(this.$address)
    return MonoType.fromAddress(address)
  }

  /**
   * Use this to obtain the class that the provided MonoClass* is nested on.
   * If the return is NULL, this indicates that this class is not nested.
   * @returns {MonoClass} The container type where this type is nested or NULL if this type is not a nested type.
   */
  get nestingType(): MonoClass {
    const address = mono_class_get_nesting_type(this.$address)
    return MonoClass.fromAddress(address)
  }

  /**
   * @returns {MonoClass} The parent class for this class.
   */
  get parent(): MonoClass {
    const address = mono_class_get_parent(this.$address)
    return MonoClass.fromAddress(address)
  }

  /**
   * @returns {number} The rank for the array (the number of dimensions).
   */
  get rank(): number {
    return mono_class_get_rank(this.$address)
  }

  /**
   * The type flags from the TypeDef table from the metadata. see the TYPE_ATTRIBUTE_* definitions on tabledefs.h for the different values.
   * @returns {number} The flags from the TypeDef table.
   */
  get flags(): number {
    return mono_class_get_flags(this.$address)
  }

  /**
   * Use this function to get the element class of an array.
   * @returns {MonoClass} - The element class of an array.
   */
  get elementClass(): MonoClass {
    const address = mono_class_get_element_class(this.$address)
    return MonoClass.fromAddress(address)
  }

  /**
   * Use this method to get the MonoImage* where this class came from.
   * @returns {MonoImage} - The image where this class is defined.
   */
  get image(): MonoImage {
    const address = mono_class_get_image(this.$address)
    return MonoImage.fromAddress(address)
  }

  /**
   *  This is for retrieving the interfaces implemented by this class.
   * @returns {Array<MonoClass>} Returns a list of interfaces implemented by this class
   */
  get interfaces(): Array<MonoClass> {
    const interfaces: Array<MonoClass> = []
    const iter = Memory.alloc(Process.pointerSize)

    let address: NativePointer
    while (!(address = mono_class_get_interfaces(this.$address, iter)).isNull()) {
      interfaces.push(MonoClass.fromAddress(address))
    }
    return interfaces
  }

  /**
   * Compute the instance_size, class_size and other infos that cannot be computed at mono_class_get() time. Also compute vtable_size if possible.
   * Returns TRUE on success or FALSE if there was a problem in loading the type (incorrect assemblies, missing assemblies, methods, etc).
   * LOCKING: Acquires the loader lock.
   * @returns {boolean} Returns true on success
   */
  init(): boolean {
    return mono_class_init(this.$address)
  }

  /**
   * @param {MonoClass} iface - The interface to check if klass implements.
   * @returns {boolean} TRUE if class implements interface.
   */
  implementsInterface(iface: MonoClass): boolean {
    return mono_class_implements_interface(this.$address, iface.$address)
  }

  /**
   * @param {number} fieldToken - The field token
   * @returns {MonoClassField} A MonoClassField representing the type and offset of the field, or a NULL value if the field does not belong to this class.
   */
  getField(fieldToken: number): MonoClassField {
    const address = mono_class_get_field(this.$address, fieldToken)
    return MonoClassField.fromAddress(address)
  }

  getFields() {
    const fields = []
    const iter = Memory.alloc(Process.pointerSize)
    let field

    while (!(field = mono_class_get_fields(this.$address, iter)).isNull()) {
      fields.push(field)
    }

    return fields
  }

  /**
   * Static methods
   */
  /**
   * Returns the MonoClass with the given typeToken on the image
   * @param {MonoImage} image     - Image where the class token will be looked up
   * @param {number}    typeToken - A type token from the image
   * @returns {MonoClass} The MonoClass with the given typeToken on the image
   */
  static get(image: MonoImage, typeToken: number): MonoClass {
    const address = mono_class_get(image.$address, typeToken)
    return MonoClass.fromAddress(address)
  }

  /**
   * Obtains a MonoClass with a given namespace and a given name which is located in the given MonoImage.
   * To reference nested classes, use the "/" character as a separator. For example use "Foo/Bar" to reference the class Bar that is nested inside Foo, like this: "class Foo { class Bar {} }".
   * @param {MonoImage} image     - The MonoImage where the type is looked up in
   * @param {string}    namespace - The type namespace
   * @param {string}    name      - The type short name
   * @returns {MonoClass} The MonoClass with the given typeToken on the image
   */
  static fromName(image: MonoImage, namespace: string, name: string): MonoClass {
    const address = mono_class_from_name(image.$address, Memory.allocUtf8String(namespace), Memory.allocUtf8String(name))
    return MonoClass.fromAddress(address)
  }

  /**
   * Obtains a MonoClass with a given namespace and a given name which is located in the given MonoImage. The namespace and name lookups are case insensitive.
   * @param {MonoImage} image     - The MonoImage where the type is looked up in
   * @param {string}    namespace - The type namespace
   * @param {string}    name      - The type short name
   * @returns {MonoClass} The MonoClass if the given namespace and name were found, or NULL if it was not found. The error object will contain information about the problem in that case.
   */
  static fromNameCaseChecked(image: MonoImage, namespace: string, name: string): MonoClass {
    const errPtr = Memory.alloc(Process.pointerSize)
    const classAddress = mono_class_from_name_case_checked(image.$address, Memory.allocUtf8String(namespace), Memory.allocUtf8String(name), errPtr)
    if (classAddress.isNull() || !errPtr.isNull()) {
      throw new Error('Error handling not implemented!')
    }
    return MonoClass.fromAddress(classAddress)
  }

  /**
   * This returns a MonoClass for the specified MonoType, the value is never NULL.
   * @param {MonoType} monoType     - The MonoImage where the type is looked up in
   * @returns {MonoClass} A MonoClass for the specified MonoType, the value is never NULL.
   */
  static fromMonoType(monoType: any): MonoClass {
    //TODO: any must be MonoType which is not implemented atm
    const address = mono_class_from_mono_type(monoType.$address)
    return MonoClass.fromAddress(address)
  }

  /**
   * Creates the MonoClass* structure representing the type defined by the typeref token valid inside image.
   * @param {MonoImage} image     - A MonoImage
   * @param {number}    typeToken - A TypeRef token
   * @returns {MonoClass} The MonoClass* representing the typeref token, NULL ifcould not be loaded.
   */
  static fromTyperef(image: MonoImage, typeToken: number): MonoClass {
    const address = mono_class_from_typeref(image.$address, typeToken)
    return MonoClass.fromAddress(address)
  }

  /**
   * Creates the MonoClass* structure representing the type defined by the typeref token valid inside image.
   * @param {MonoImage} image     - A MonoImage
   * @param {number}    typeToken - A TypeRef token
   * @returns {MonoClass} The MonoClass* representing the typeref token, NULL ifcould not be loaded.
   */
  static fromTyperefChecked(image: MonoImage, typeToken: number): MonoClass {
    const errPtr = Memory.alloc(Process.pointerSize)
    const classAddress = mono_class_from_typeref_checked(image.$address, typeToken, errPtr)
    if (classAddress.isNull()) {
      if (!errPtr.isNull()) throw new Error('Error handling not implemented!')
      return null
    }
    return MonoClass.fromAddress(classAddress)
  }

  /**
   * @param {MonoGenericParam} param - Parameter to find/construct a class for.
   * @returns {MonoClass}
   */
  static fromGenericParameter(param: any /*MonoGenericParam*/): MonoClass {
    // MonoClass* mono_class_from_generic_parameter (MonoGenericParam *param, MonoImage *arg2 G_GNUC_UNUSED, gboolean arg3 G_GNUC_UNUSED)
    throw new Error('MonoClass.fromGenericParameter is not implemented!')
  }

  static fromAddress(address: NativePointer): MonoClass {
    if (address.isNull()) return null
    const addressNumber = address.toInt32()

    if (cache[addressNumber] === undefined) {
      cache[addressNumber] = new MonoClass({ address })
    }

    return cache[addressNumber]
  }

  // See: docs.go-mono.com/monodoc.ashx?link=xhtml%3adeploy%2fmono-api-image.html#api:mono_image_loaded
  /*static loaded(assemblyName: string): MonoImage {
    const address: NativePointer = natives.mono_image_loaded(Memory.allocUtf8String(assemblyName))
    return MonoImage.from(address)
  }

  static from(address: NativePointer) {
    if (address.isNull()) return null

    const addressNumber = address.toInt32()

    if (cache[addressNumber] === undefined) {
      cache[addressNumber] = new MonoImage({ address })
    }

    return cache[addressNumber]
  }*/
}
