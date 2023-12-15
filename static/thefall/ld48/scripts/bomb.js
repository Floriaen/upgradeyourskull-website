function bomb(pos) {

	var doSuction = true;
	for (b = this._world.m_bodyList; b; b = b.m_next) {
		var b2TouchPosition = new b2Vec2(pos.x/this._scaleRatio, pos.y/this._scaleRatio);
		var b2BodyPosition = new b2Vec2(b.GetPosition().x, b.GetPosition().y);
		
		var maxDistance = 9; // In your head don't forget this number is low because we're multiplying it by 32 pixels;
		var maxForce = 22;
		var distance; // Why do i want to use CGFloat vs float - I'm not sure, but this mixing seems to work fine for this little test.
		var strength;
		var force;
		var angle;
		// To go towards the press, all we really change is the atanf function, and swap which goes first to reverse the angle
		if (doSuction) {
			// Get the distance, and cap it
			distance = new b2Distance(b2BodyPosition, b2TouchPosition);
			if (distance > maxDistance) {
				distance = maxDistance - 0.01;
			}
			// Get the strength
			//strength = distance / maxDistance; // Uncomment and reverse these two. and ones further away will get more force instead of less
			strength = (maxDistance - distance) / maxDistance; // This makes it so that the closer something is - the stronger, instead of further
			force = strength * maxForce;

			// Get the angle
			angle = Math.atan2(b2TouchPosition.y - b2BodyPosition.y, b2TouchPosition.x - b2BodyPosition.x);
			//NSLog(@" distance:%0.2f,force:%0.2f", distance, force);
			// Apply an impulse to the body, using the angle
			b.ApplyImpulse(new b2Vec2(Math.cos(angle) * force, Math.sin(angle) * force), b.GetPosition());
		}
		else
		{
			distance = b2Distance(b2BodyPosition, b2TouchPosition);
			if(distance > maxDistance) {
				distance = maxDistance - 0.01;
			}

			// Normally if distance is max distance, it'll have the most strength, this makes it so the opposite is true - closer = stronger
			strength = (maxDistance - distance) / maxDistance; // This makes it so that the closer something is - the stronger, instead of further
			force = strength * maxForce;
			angle = Math.atan2(b2BodyPosition.y - b2TouchPosition.y, b2BodyPosition.x - b2TouchPosition.x);
			//NSLog(@" distance:%0.2f,force:%0.2f,angle:%0.2f", distance, force, angle);
			// Apply an impulse to the body, using the angle
			b.ApplyImpulse(new b2Vec2(Math.cos(angle) * force, Math.sin(angle) * force), b.GetPosition());
		}
		
	}



}