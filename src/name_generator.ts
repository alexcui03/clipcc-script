class NameGenerator {
    private usedName = new Set<string>();
    private cntName = new Map<string, number>();

    public checkName(name: string): string {
        if (this.usedName.has(name)) {
            const suffix = this.cntName.get(name) + 1;
            this.cntName.set(name, suffix + 1);
            name = name + suffix.toString();
        }
        this.usedName.add(name);
        return name;
    }
}

export default NameGenerator;
