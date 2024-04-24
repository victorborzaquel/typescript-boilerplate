import {DefaultNamingStrategy, NamingStrategyInterface} from 'typeorm';

export class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  columnName(
    propertyName: string,
    customName: string,
    _embeddedPrefixes: string[]
  ): string {
    return customName || this.camelToSnake(propertyName);
  }

  relationName(propertyName: string): string {
    return this.camelToSnake(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return this.camelToSnake(relationName + '_' + referencedColumnName);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    _firstPropertyName: string,
    _secondPropertyName: string
  ): string {
    return this.camelToSnake(firstTableName + '_' + secondTableName);
  }

  joinTableColumnName(
    _tableName: string,
    propertyName: string,
    _columnName?: string
  ): string {
    return this.camelToSnake(propertyName);
  }

  private camelToSnake(camelCase: string): string {
    return camelCase.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}
