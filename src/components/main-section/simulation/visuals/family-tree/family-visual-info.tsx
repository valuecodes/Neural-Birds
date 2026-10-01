const FamilyVisualInfo = ({ text }: { text: string }) => (
  <div className="familyVisualInfo visualInfo">
    <p>{text}</p>
    <div className="divParents parentOne">Parent 1</div>
    <div className="divParents parentTwo">Parent 2</div>
  </div>
);

export { FamilyVisualInfo };
