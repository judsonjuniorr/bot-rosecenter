interface AliasObject {
  item: string;
  alias: string[];
}

class Aliases {
  private aliases: Array<AliasObject> = [
    {
      item: 'Astarot Wing',
      alias: ['Astharot Wing', 'Astharot Wings', 'Astaroth Wings'],
    },
    {
      item: 'Platinum Bow',
      alias: ['plantium bow'],
    },
  ];

  public find(name: string): string {
    const item = this.aliases.find(alias => alias.alias.includes(name));
    return item?.item || name;
  }
}

export default new Aliases();
