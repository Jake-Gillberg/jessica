const tagString = (tag: (template: TemplateStringsArray, ...args: any[]) => any) => {
    function tagged(template: TemplateStringsArray, ...args: any[]) {
        const cooked = args.reduce((prior, hole, i) => {
            prior.push(String(hole), template[i + 1]);
            return prior;
        }, [template[0]]);
        const tmpl = [cooked.join('')];
        const raw = args.reduce((prior, hole, i) => {
            prior.push(String(hole), template.raw[i + 1]);
            return prior;
        }, [template.raw[0]]);
        return tag(Object.assign(tmpl, { raw: [raw.join('')] }));
    }
    return harden(tagged);
};

export default harden(tagString);
